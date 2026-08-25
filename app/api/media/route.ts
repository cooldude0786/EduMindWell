import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const mediaGroup = searchParams.get("mediaGroup");
    const all = searchParams.get("all") === "true";
    const limitParam = searchParams.get("limit");
    const offset = Math.max(Number(searchParams.get("offset") ?? 0) || 0, 0);
    const limit = limitParam ? Math.min(Math.max(Number(limitParam) || 10, 1), 50) : undefined;

    // Public requests may only read published assets. Hidden/admin listings
    // require the existing authenticated admin session.
    if (all) {
      const token = await getToken({ req: req as any });
      if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whereClause: any = {};

    if (mediaGroup) {
      whereClause.mediaGroup = mediaGroup;
    } else if (section) {
      if (section === "HERO") {
        whereClause.mediaGroup = "HERO";
      } else {
        whereClause.mediaGroup = section === "GALLERY" ? "ASSESSMENT" : section;
      }
    }

    if (!all) {
      whereClause.isPublished = true;
    }

    const assets = await prisma.mediaAsset.findMany({
      where: whereClause,
      ...(limit ? { skip: offset, take: limit } : {}),
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" }
      ]
    });

    if (!limit) return Response.json(assets);
    const total = await prisma.mediaAsset.count({ where: whereClause });
    return Response.json({ assets, hasMore: offset + assets.length < total, total });
  } catch (error: unknown) {
    console.error("Fetch media assets error:", error);
    return Response.json({ error: "Failed to fetch media assets" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Media ID is required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { id }
    });

    if (!asset) {
      return Response.json({ error: "Media asset not found" }, { status: 404 });
    }

    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from(asset.bucket)
      .remove([asset.path]);

    if (storageError) {
      console.error("Failed to delete from Supabase storage:", storageError);
    }

    // Delete from Database
    await prisma.mediaAsset.delete({
      where: { id }
    });

    return Response.json({ message: "Media asset deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete media asset error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "Failed to delete media asset", details: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, altText, isPublished, sortOrder } = await req.json();

    if (!id) {
      return Response.json({ error: "Media ID is required" }, { status: 400 });
    }

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        altText: altText !== undefined ? altText : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
      }
    });

    return Response.json(updated);
  } catch (error: unknown) {
    console.error("Update media asset error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "Failed to update media asset", details: message }, { status: 500 });
  }
}
