import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { subject, body } = await req.json();

    // Validation
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

    // Check if subscribers exist before creating campaign
    const subscriberCount = await prisma.emailRecipient.count();

    if (subscriberCount === 0) {
      return Response.json(
        { error: "Cannot create campaign: no subscribers found. Add subscribers first." },
        { status: 400 }
      );
    }

    const campaign = await prisma.bulkEmail.create({
      data: {
        id: crypto.randomUUID(),
        subject: subject.trim(),
        body: body.trim(),
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