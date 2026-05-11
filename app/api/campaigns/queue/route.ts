import { qstash } from "@/lib/qstash";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  console.log("QUEUE API HIT");

  try {
    const { campaignId } = await req.json();

    if (!campaignId || typeof campaignId !== "string") {
      return Response.json({
        error: "campaignId is required and must be a string",
      }, { status: 400 });
    }

  const campaign = await prisma.bulkEmail.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    return Response.json({
      error: "Campaign not found",
    }, { status: 404 });
  }

  if (campaign.status !== "PENDING") {
    return Response.json({
      error: `Campaign cannot be queued when status is ${campaign.status}.`,
      currentStatus: campaign.status,
    }, { status: 409 });
  }

  const existingJobs = await prisma.emailQueue.findMany({
    where: { campaignId, status: "PENDING" },
  });

  if (existingJobs.length > 0) {
    return Response.json(
      {
        error: "Campaign already queued",
        queued: existingJobs.length,
      },
      { status: 409 }
    );
  }

  const recipients = await prisma.emailRecipient.findMany();

  if (recipients.length === 0) {
    return Response.json({
      error: "No subscribers found. Add subscribers before queueing a campaign.",
      recipientCount: 0,
    }, { status: 400 });
  }

  type PublishJob = {
    id: string;
  };

  const queueData = recipients.map((recipient) => ({
    id: crypto.randomUUID(),
    campaignId: campaign.id,
    recipientId: recipient.id,
    email: recipient.email,
    subject: campaign.subject,
    body: campaign.body,
    status: "PENDING" as const,
  }));

  await prisma.emailQueue.createMany({
    data: queueData,
  });

  const jobs: PublishJob[] = queueData.map((job) => ({ id: job.id }));
  const createdJobIds = queueData.map((job) => job.id);

  if (jobs.length === 0) {
    return Response.json({
      message: "No pending queue jobs available",
      queued: 0,
    });
  }

  const publishUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;

  if (!publishUrl) {
    return Response.json(
      {
        error:
          "Missing publish base URL. Set NEXT_PUBLIC_BASE_URL or BASE_URL to a public https:// URL.",
      },
      { status: 500 }
    );
  }

  const parsedPublishUrl = new URL(publishUrl);

  if (
    parsedPublishUrl.protocol !== "https:" ||
    parsedPublishUrl.hostname === "localhost" ||
    parsedPublishUrl.hostname === "127.0.0.1" ||
    parsedPublishUrl.hostname === "::1"
  ) {
    return Response.json(
      {
        error:
          "Invalid publish URL for QStash. QStash requires a public https:// callback URL, not localhost or loopback.",
        publishUrl,
      },
      { status: 500 }
    );
  }

  const destinationUrl = new URL("/api/email/send", publishUrl).toString();
  console.log("QStash publish URL:", destinationUrl);

  try {
    for (const job of jobs) {
      await qstash.publishJSON({
        url: destinationUrl,
        body: { jobId: job.id },
      });
    }
  } catch (error: any) {
    await prisma.emailQueue.deleteMany({
      where: {
        id: {
          in: createdJobIds,
        },
      },
    });

    console.error("QStash publish failed", {
      url: destinationUrl,
      tokenPresent: Boolean(process.env.QSTASH_TOKEN),
      baseUrl: process.env.QSTASH_URL || process.env.QSTASH_REGION,
      cleanedUpJobs: createdJobIds.length,
      error,
    });

    return Response.json(
      {
        error: "QStash publish failed",
        cleanedUpJobs: createdJobIds.length,
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }

  await prisma.bulkEmail.update({
    where: { id: campaign.id },
    data: {
      status: "PROCESSING",
    },
  });

    return Response.json({
      message: "Queued via QStash",
      queued: jobs.length,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: "Failed to queue campaign",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
