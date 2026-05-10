import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");

  if (!campaignId) {
    return Response.json({ error: "Missing campaignId" }, { status: 400 });
  }

  const [total, sent, failed, pending] = await Promise.all([
    prisma.emailQueue.count({
      where: { campaignId },
    }),
    prisma.emailQueue.count({
      where: { campaignId, status: "SENT" },
    }),
    prisma.emailQueue.count({
      where: { campaignId, status: "FAILED" },
    }),
    prisma.emailQueue.count({
      where: { campaignId, status: "PENDING" },
    }),
  ]);

  return Response.json({
    total,
    sent,
    failed,
    pending,
    progress: total === 0 ? 0 : Math.round((sent / total) * 100),
  });
}