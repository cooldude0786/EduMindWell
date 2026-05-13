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
      campaignIds.add(job.campaignId);

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

      await prisma.emailLog.create({
        data: {
          id: crypto.randomUUID(),
          bulkEmailId: job.campaignId,
          recipientId: job.recipientId,
          status: "SENT",
          messageId: info.messageId,
        },
      });

    } catch (err: any) {
      await prisma.emailQueue.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: err.message,
          attempts: { increment: 1 },
        },
      });
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
