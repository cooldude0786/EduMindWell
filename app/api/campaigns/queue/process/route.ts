import { prisma } from "@/lib/prisma";
import { getDefaultFromAddress, transporter } from "@/lib/mail";

export async function POST() {
  const jobs = await prisma.emailQueue.findMany({
    where: { status: "PENDING" },
    take: 10,
  });

  const campaignIds = new Set<string>();

  for (const job of jobs) {
    try {
      if (job.campaignId) campaignIds.add(job.campaignId);

      await prisma.emailQueue.update({
        where: { id: job.id },
        data: { status: "PROCESSING" },
      });

      const info = await transporter.sendMail({
        from: getDefaultFromAddress(),
        to: job.email,
        subject: job.subject,
        text: job.body,
      });

      await prisma.emailQueue.update({
        where: { id: job.id },
        data: {
          status: "SENT",
          processedAt: new Date(),
        },
      });

      if (job.campaignId && job.recipientId) {
        await prisma.emailLog.create({
          data: {
            id: crypto.randomUUID(),
            bulkEmailId: job.campaignId,
            recipientId: job.recipientId,
            status: "SENT",
            messageId: info.messageId,
          },
        });
      } else {
        await prisma.emailLog.create({
          data: {
            type: "CONSULTATION",
            recipientEmail: job.email,
            subject: job.subject,
            status: "SENT",
            messageId: info.messageId,
          },
        });
      }

    } catch (error: unknown) {
      await prisma.emailQueue.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: error instanceof Error ? error.message : String(error),
          attempts: { increment: 1 },
        },
      });
      if (!job.campaignId) {
        await prisma.emailLog.create({
          data: {
            type: "CONSULTATION",
            recipientEmail: job.email,
            subject: job.subject,
            status: "FAILED",
            error: error instanceof Error ? error.message : String(error),
          },
        });
      }
    }
  }

  // ✅ UPDATE CAMPAIGNS ONCE (IMPORTANT FIX)
  for (const campaignId of campaignIds) {
    const remaining = await prisma.emailQueue.count({
      where: {
        campaignId,
        status: "PENDING",
      },
    });

    await prisma.bulkEmail.update({
      where: { id: campaignId },
      data: {
        status: remaining === 0 ? "SENT" : "PROCESSING",
        sentAt: remaining === 0 ? new Date() : undefined,
      },
    });
  }

  return Response.json({
    message: "Queue processed",
    processed: jobs.length,
  });
}
