import { prisma } from "@/lib/prisma";
import { getDefaultFromAddress, transporter } from "@/lib/mail";

export async function POST(req: Request) {
  const { jobId } = await req.json();

  if (!jobId) {
    return Response.json(
      { error: "jobId required" },
      { status: 400 }
    );
  }

  const job = await prisma.emailQueue.findUnique({
    where: { id: jobId },
    include: {
      BulkEmail: true,
    },
  });

  if (!job || job.status !== "PENDING") {
    return Response.json({ skipped: true });
  }

  const campaign = job.BulkEmail;
  const senderEmail = campaign?.senderEmail?.trim() || getDefaultFromAddress();
  const senderName = campaign?.senderName?.trim();
  const fromAddress = senderName ? `${senderName} <${senderEmail}>` : senderEmail;

  try {
    await prisma.emailQueue.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    const info = await transporter.sendMail({
      from: fromAddress,
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

    const remaining = await prisma.emailQueue.count({
      where: {
        campaignId: job.campaignId,
        status: "PENDING",
      },
    });

    await prisma.bulkEmail.update({
      where: { id: job.campaignId },
      data: {
        status: remaining === 0 ? "SENT" : "PROCESSING",
        sentAt: remaining === 0 ? new Date() : undefined,
      },
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    await prisma.emailQueue.update({
      where: { id: job.id },
      data: {
        status: "FAILED",
        error: err.message,
        attempts: { increment: 1 },
      },
    });

    await prisma.emailLog.create({
      data: {
        id: crypto.randomUUID(),
        bulkEmailId: job.campaignId,
        recipientId: job.recipientId,
        status: "FAILED",
        error: err.message,
      },
    });

    return Response.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
