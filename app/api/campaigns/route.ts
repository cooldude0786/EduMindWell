import { prisma } from "@/lib/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const {
      title,
      subject,
      body,
      senderName,
      senderEmail,
      previewText,
      scheduledAt,
      isDraft,
    } = await req.json();

    // Validation
    if (title && typeof title !== "string") {
      return Response.json({ error: "Campaign title must be a string." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return Response.json(
        { error: "Campaign subject is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return Response.json(
        { error: "Campaign body is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (title?.trim().length > 200) {
      return Response.json(
        { error: "Campaign title must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (subject.trim().length > 200) {
      return Response.json(
        { error: "Campaign subject must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (body.trim().length > 10000) {
      return Response.json(
        { error: "Campaign body must be 10000 characters or less" },
        { status: 400 }
      );
    }

    if (previewText && typeof previewText === "string" && previewText.trim().length > 160) {
      return Response.json(
        { error: "Preview text must be 160 characters or less" },
        { status: 400 }
      );
    }

    if (senderEmail && typeof senderEmail === "string") {
      if (!emailRegex.test(senderEmail.trim())) {
        return Response.json(
          { error: "Sender email must be a valid email address." },
          { status: 400 }
        );
      }
    }

    let scheduledAtDate: Date | undefined;

    if (scheduledAt) {
      const parsedDate = new Date(scheduledAt);

      if (Number.isNaN(parsedDate.getTime())) {
        return Response.json(
          { error: "scheduledAt must be a valid date." },
          { status: 400 }
        );
      }

      scheduledAtDate = parsedDate;
    }

    // Check if subscribers exist before creating a live campaign
    if (!Boolean(isDraft)) {
      const subscriberCount = await prisma.emailRecipient.count();

      if (subscriberCount === 0) {
        return Response.json(
          { error: "Cannot create campaign: no subscribers found. Add subscribers first." },
          { status: 400 }
        );
      }
    }

    const campaign = await prisma.bulkEmail.create({
      data: {
        id: crypto.randomUUID(),
        title: title?.trim() || null,
        subject: subject.trim(),
        body: body.trim(),
        senderName: senderName?.trim() || null,
        senderEmail: senderEmail?.trim() || null,
        previewText: previewText?.trim() || null,
        scheduledAt: scheduledAtDate,
        isDraft: Boolean(isDraft),
        status: "PENDING",
      },
    });

    return Response.json(campaign);
  } catch (error: any) {
    console.error("Campaign creation error:", error);
    return Response.json(
      { error: "Failed to create campaign", details: error?.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const {
      campaignId,
      title,
      subject,
      body,
      senderName,
      senderEmail,
      previewText,
      scheduledAt,
      isDraft,
    } = await req.json();

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
      return Response.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (campaign.status !== "PENDING") {
      return Response.json(
        {
          error: `Campaign cannot be updated when status is ${campaign.status}.`,
          currentStatus: campaign.status,
        },
        { status: 409 }
      );
    }

    if (title && typeof title !== "string") {
      return Response.json({ error: "Campaign title must be a string." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return Response.json(
        { error: "Campaign subject is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return Response.json(
        { error: "Campaign body is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (title?.trim().length > 200) {
      return Response.json(
        { error: "Campaign title must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (subject.trim().length > 200) {
      return Response.json(
        { error: "Campaign subject must be 200 characters or less" },
        { status: 400 }
      );
    }

    if (body.trim().length > 10000) {
      return Response.json(
        { error: "Campaign body must be 10000 characters or less" },
        { status: 400 }
      );
    }

    if (previewText && typeof previewText === "string" && previewText.trim().length > 160) {
      return Response.json(
        { error: "Preview text must be 160 characters or less" },
        { status: 400 }
      );
    }

    if (senderEmail && typeof senderEmail === "string") {
      if (!emailRegex.test(senderEmail.trim())) {
        return Response.json(
          { error: "Sender email must be a valid email address." },
          { status: 400 }
        );
      }
    }

    let scheduledAtDate: Date | undefined;

    if (scheduledAt) {
      const parsedDate = new Date(scheduledAt);

      if (Number.isNaN(parsedDate.getTime())) {
        return Response.json(
          { error: "scheduledAt must be a valid date." },
          { status: 400 }
        );
      }

      scheduledAtDate = parsedDate;
    }

    if (!Boolean(isDraft)) {
      const subscriberCount = await prisma.emailRecipient.count();

      if (subscriberCount === 0) {
        return Response.json(
          { error: "Cannot publish campaign: no subscribers found. Add subscribers first." },
          { status: 400 }
        );
      }
    }

    const updatedCampaign = await prisma.bulkEmail.update({
      where: { id: campaignId },
      data: {
        title: title?.trim() || null,
        subject: subject.trim(),
        body: body.trim(),
        senderName: senderName?.trim() || null,
        senderEmail: senderEmail?.trim() || null,
        previewText: previewText?.trim() || null,
        scheduledAt: scheduledAtDate,
        isDraft: Boolean(isDraft),
      },
    });

    return Response.json(updatedCampaign);
  } catch (error: any) {
    console.error("Campaign update error:", error);
    return Response.json(
      { error: "Failed to update campaign", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const campaigns = await prisma.bulkEmail.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(campaigns);
  } catch (error: any) {
    console.error("Failed to fetch campaigns:", error);
    return Response.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}