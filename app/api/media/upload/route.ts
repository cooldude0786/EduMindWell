import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const token = await getToken({ req: req as any });
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const section = formData.get("section") as string | null; // e.g. "GALLERY", "WELLNESS", "WORKSHOPS", "HERO"
    const requestedMediaGroup = formData.get("mediaGroup") as string | null;
    const title = formData.get("title") as string | null;
    const altText = formData.get("altText") as string | null;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!section) {
      return Response.json({ error: "Section is required" }, { status: 400 });
    }

    // Validate section enum
    const validSections = ["GALLERY", "CAREER", "WELLNESS", "WORKSHOPS", "TESTIMONIALS", "CAMPAIGNS", "HERO"];
    if (!validSections.includes(section)) {
      return Response.json({ error: `Invalid section: ${section}` }, { status: 400 });
    }

    // 3. Determine folder path inside the bucket
    let folder = "general";
    if (section === "GALLERY") {
      folder = "assessments";
    } else if (section === "WELLNESS") {
      folder = "wellness";
    } else if (section === "WORKSHOPS") {
      folder = "workshop";
    } else if (section === "HERO") {
      folder = "hero";
    } else {
      folder = section.toLowerCase();
    }

    // 4. File details
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const sizeBytes = file.size;
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "bin";
    if (sizeBytes > 50 * 1024 * 1024) {
      return Response.json({ error: "File is too large. Maximum size is 50MB." }, { status: 400 });
    }
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const storagePath = `${folder}/${fileName}`;

    // Determine type: IMAGE or VIDEO
    let type: "IMAGE" | "VIDEO" = "IMAGE";
    if (mimeType.startsWith("video/")) {
      type = "VIDEO";
    } else if (!mimeType.startsWith("image/")) {
      return Response.json({ error: "Unsupported file type. Only images and videos are allowed." }, { status: 400 });
    }

    // 5. Upload to Supabase Storage
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "edumindwell";
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        duplex: "half",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      const isRlsError = uploadError.statusCode === "403";
      const details = isRlsError
        ? `Supabase rejected the upload with Storage RLS. Set SUPABASE_SERVICE_ROLE_KEY to the server service_role key (not the anon key), or add an INSERT policy for bucket "${bucketName}".`
        : uploadError.message;
      return Response.json({ error: `Upload to storage failed: ${details}` }, { status: 500 });
    }

    // 6. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    // 7. Save metadata in Prisma DB
    // NextAuth's token subject is not guaranteed to be the Prisma User id.
    // Only persist the relation when the referenced user actually exists.
    const uploadedById = token.sub
      ? (await prisma.user.findUnique({ where: { id: token.sub }, select: { id: true } }))?.id ?? null
      : null;

    let dbSection: "GALLERY" | "CAREER" | "WELLNESS" | "WORKSHOPS" | "TESTIMONIALS" | "CAMPAIGNS" = "GALLERY";
    let dbDescription = "";
    let mediaGroup: "ASSESSMENT" | "COUNSELLING" | "WELLNESS" | "WORKSHOPS" | "HERO" = "ASSESSMENT";

    if (section === "HERO") {
      dbSection = "GALLERY";
      dbDescription = "HERO";
      mediaGroup = "HERO";
    } else {
      dbSection = section as any;
      dbDescription = title?.startsWith("COVER:") ? title : "";
      mediaGroup = requestedMediaGroup === "COUNSELLING"
        ? "COUNSELLING"
        : section === "GALLERY" ? "ASSESSMENT" : section as "WELLNESS" | "WORKSHOPS";
    }

    let mediaAsset: Awaited<ReturnType<typeof prisma.mediaAsset.create>>;
    try {
      mediaAsset = await prisma.mediaAsset.create({
        data: {
          id: crypto.randomUUID(),
          title: title?.trim() || null,
          altText: altText?.trim() || null,
          description: dbDescription || null,
          type,
          bucket: bucketName,
          path: storagePath,
          publicUrl,
          mimeType,
          sizeBytes,
          section: dbSection,
          mediaGroup,
          isPublished: true,
          uploadedById,
        },
      });
    } catch (databaseError) {
      await supabase.storage.from(bucketName).remove([storagePath]);
      throw databaseError;
    }

    return Response.json(mediaAsset, { status: 201 });
  } catch (error: unknown) {
    console.error("Media upload error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: "Failed to upload media", details: message }, { status: 500 });
  }
}
