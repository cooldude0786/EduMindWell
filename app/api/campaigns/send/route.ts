import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    if (!campaignId) {
      return Response.json(
        { error: "Campaign ID required" },
        { status: 400 }
      );
    }

    // 1. Get campaign
    const campaign = await prisma.bulkEmail.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return Response.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // 2. Prevent duplicate sending
    if (campaign.status === "SENT") {
      return Response.json(
        { error: "Campaign already sent" },
        { status: 400 }
      );
    }

    // 3. Get subscribers
    const subscribers = await prisma.emailRecipient.findMany();

    if (subscribers.length === 0) {
      return Response.json(
        { error: "No subscribers found" },
        { status: 400 }
      );
    }

    // 4. Mark as sending (important state)
    await prisma.bulkEmail.update({
      where: { id: campaign.id },
      data: {
        status: "PENDING",
      },
    });

    // 5. Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 6. Send emails
    for (const sub of subscribers) {
      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: sub.email,
          subject: campaign.subject,
          text: campaign.body,
        });

        await prisma.emailLog.create({
          data: {
            id: crypto.randomUUID(),
            bulkEmailId: campaign.id,
            recipientId: sub.id,
            status: "SENT",
            messageId: info.messageId,
          },
        });
      } catch (err: any) {
        await prisma.emailLog.create({
          data: {
            id: crypto.randomUUID(),
            bulkEmailId: campaign.id,
            recipientId: sub.id,
            status: "FAILED",
            error: err.message,
          },
        });
      }
    }

    // 7. Final update
    await prisma.bulkEmail.update({
      where: { id: campaign.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return Response.json({
      message: "Campaign sent successfully",
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}