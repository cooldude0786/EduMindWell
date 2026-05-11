import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    if (!campaignId || typeof campaignId !== "string") {
      return Response.json(
        { error: "campaignId is required and must be a string" },
        { status: 400 }
      );
    }

    const campaign = await prisma.bulkEmail.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status === "SENT") {
      return Response.json(
        { error: "Sent campaigns cannot be reset." },
        { status: 409 }
      );
    }

    const [pendingCount, processingCount, sentCount, failedCount] = await Promise.all([
      prisma.emailQueue.count({
        where: { campaignId, status: "PENDING" },
      }),
      prisma.emailQueue.count({
        where: { campaignId, status: "PROCESSING" },
      }),
      prisma.emailQueue.count({
        where: { campaignId, status: "SENT" },
      }),
      prisma.emailQueue.count({
        where: { campaignId, status: "FAILED" },
      }),
    ]);

    if (sentCount > 0 || failedCount > 0) {
      return Response.json(
        {
          error:
            "This campaign already has sent or failed jobs. Create a new campaign instead of resetting this one.",
          sentCount,
          failedCount,
        },
        { status: 409 }
      );
    }

    const resettableJobs = pendingCount + processingCount;

    if (resettableJobs === 0) {
      await prisma.bulkEmail.update({
        where: { id: campaignId },
        data: {
          status: "PENDING",
          sentAt: null,
        },
      });

      return Response.json({
        message: "Campaign was already clear.",
        deleted: 0,
      });
    }

    const deletedJobs = await prisma.emailQueue.deleteMany({
      where: {
        campaignId,
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
    });

    await prisma.bulkEmail.update({
      where: { id: campaignId },
      data: {
        status: "PENDING",
        sentAt: null,
      },
    });

    return Response.json({
      message: "Queue reset successfully.",
      deleted: deletedJobs.count,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Failed to reset campaign queue",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
