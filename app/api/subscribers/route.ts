import { prisma } from "@/lib/prisma";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Validation
    if (!email || typeof email !== "string") {
      return Response.json(
        { error: "Email is required and must be a string" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return Response.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (name && typeof name !== "string") {
      return Response.json(
        { error: "Name must be a string" },
        { status: 400 }
      );
    }

    if (name && name.trim().length > 100) {
      return Response.json(
        { error: "Name must be 100 characters or less" },
        { status: 400 }
      );
    }

    // Check uniqueness
    const existingSubscriber = await prisma.emailRecipient.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingSubscriber) {
      return Response.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    const subscriber = await prisma.emailRecipient.create({
      data: {
        id: crypto.randomUUID(),
        email: trimmedEmail,
        name: name?.trim() || null,
      },
    });

    return Response.json(subscriber, { status: 201 });
  } catch (error: any) {
    console.error("Subscriber creation error:", error);
    return Response.json(
      { error: "Failed to create subscriber", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.emailRecipient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(subscribers);
  } catch (error: any) {
    console.error("Subscriber fetch error:", error);
    return Response.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, email, name } = await req.json();

    if (!id) {
      return Response.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    // Find existing subscriber
    const subscriber = await prisma.emailRecipient.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return Response.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Validate and update email if provided
    if (email) {
      const trimmedEmail = email.trim().toLowerCase();

      if (!emailRegex.test(trimmedEmail)) {
        return Response.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check uniqueness for other subscribers
      const existingSubscriber = await prisma.emailRecipient.findUnique({
        where: { email: trimmedEmail },
      });

      if (existingSubscriber && existingSubscriber.id !== id) {
        return Response.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      updateData.email = trimmedEmail;
    }

    // Validate and update name if provided
    if (name !== undefined) {
      if (name && typeof name !== "string") {
        return Response.json(
          { error: "Name must be a string" },
          { status: 400 }
        );
      }

      if (name && name.trim().length > 100) {
        return Response.json(
          { error: "Name must be 100 characters or less" },
          { status: 400 }
        );
      }

      updateData.name = name?.trim() || null;
    }

    const updated = await prisma.emailRecipient.update({
      where: { id },
      data: updateData,
    });

    return Response.json(updated);
  } catch (error: any) {
    console.error("Subscriber update error:", error);
    return Response.json(
      { error: "Failed to update subscriber", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.emailRecipient.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return Response.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    await prisma.emailRecipient.delete({
      where: { id },
    });

    return Response.json(
      { message: "Subscriber deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Subscriber delete error:", error);
    return Response.json(
      { error: "Failed to delete subscriber", details: error?.message },
      { status: 500 }
    );
  }
}
