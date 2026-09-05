import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

const institutionSettingId = "institution-logo-display";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaGroup = searchParams.get("mediaGroup");

    if (mediaGroup !== "INSTITUTIONS") {
      return Response.json({ error: "Unsupported media group" }, { status: 400 });
    }

    const setting = await prisma.mediaDisplaySetting.findUnique({
      where: { mediaGroup: "INSTITUTIONS" },
    });

    return Response.json({ showTitles: setting?.showTitles ?? false });
  } catch (error: unknown) {
    console.error("Fetch media display setting error:", error);
    return Response.json({ error: "Failed to fetch media display setting" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { mediaGroup, showTitles } = await req.json();
    if (mediaGroup !== "INSTITUTIONS" || typeof showTitles !== "boolean") {
      return Response.json({ error: "Invalid media display setting" }, { status: 400 });
    }

    const setting = await prisma.mediaDisplaySetting.upsert({
      where: { mediaGroup: "INSTITUTIONS" },
      create: { id: institutionSettingId, mediaGroup: "INSTITUTIONS", showTitles },
      update: { showTitles },
    });

    return Response.json(setting);
  } catch (error: unknown) {
    console.error("Update media display setting error:", error);
    return Response.json({ error: "Failed to update media display setting" }, { status: 500 });
  }
}