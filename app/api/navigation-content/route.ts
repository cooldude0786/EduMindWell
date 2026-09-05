import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";

const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "edumindwell";

const defaults = [
  { section: "CAREER", itemKey: "assessment", title: "Career Assessments", description: "Assessment-led discovery inspired by the Edumilestones flow.", imageUrl: "/CA.jpeg" },
  { section: "CAREER", itemKey: "counselling", title: "Career Counselling", description: "Expert counsellors review the report and guide students through the dashboard.", imageUrl: "/CC.jpeg" },
  { section: "CAREER", itemKey: "library", title: "Career Library", description: "A growing reference library for careers, pathways, and planning.", imageUrl: "/CL.jpeg" },
  { section: "MINDSET", itemKey: "students", title: "Students", description: "Time management, goal setting, personality development, exam stress, confidence, emotional intelligence, and resilience.", imageUrl: "/StudentMindset.jpeg" },
  { section: "MINDSET", itemKey: "parents", title: "Parents", description: "Parenting guidance for toddler age 2 to 6, young minds 7 to 12, and the new-age child 13 to 17.", imageUrl: "/ParentMindset.jpeg" },
  { section: "MINDSET", itemKey: "teachers", title: "Teachers / Professionals", description: "Classroom management without stress, emotional intelligence, relationship skills, team bonding, resilience, limiting beliefs, and goal achievement.", imageUrl: "/ProMindset.jpeg" },
  { section: "WELLNESS", itemKey: "therapeutic", title: "Customized Therapeutic Meditation", description: "Personalized support designed around stress, confidence, relationships, health, and clarity.", imageUrl: "/Therapeutic.jpeg" },
  { section: "WELLNESS", itemKey: "coaching", title: "Individual Wellness Coaching", description: "One-on-one coaching that keeps the focus on practical growth and steady support.", imageUrl: "/oneToOne.jpeg" },
  { section: "WELLNESS", itemKey: "groups", title: "Group Meditation Programs", description: "Flexible programs for schools, parents, students, corporates, and community groups.", imageUrl: "/groupMed.jpeg" },
  { section: "WELLNESS", itemKey: "app", title: "MiracleX App", description: "A daily companion with guided meditation, gratitude, affirmations, goals, and tracking.", imageUrl: "/MiracleX.jpeg" },
  { section: "WELLNESS", itemKey: "videos", title: "Learning Videos", description: "Supportive video content for ongoing wellness habits and low-friction learning.", imageUrl: "/LearningVideo.jpeg" },
] as const;

const sections = ["CAREER", "MINDSET", "WELLNESS"] as const;
type NavigationSection = (typeof sections)[number];

function getDefault(section: NavigationSection, itemKey: string) {
  return defaults.find((item) => item.section === section && item.itemKey === itemKey);
}

export async function GET() {
  try {
    const records = await prisma.navigationContent.findMany({ orderBy: [{ section: "asc" }, { itemKey: "asc" }] });
    const byKey = new Map(records.map((record) => [`${record.section}:${record.itemKey}`, record]));
    return Response.json(defaults.map((item) => byKey.get(`${item.section}:${item.itemKey}`) ?? {
      id: `default-${item.section.toLowerCase()}-${item.itemKey}`,
      ...item,
      imagePath: null,
      bucket: null,
      showTitle: true,
      showDescription: true,
    }));
  } catch (error: unknown) {
    console.error("Fetch navigation content error:", error);
    return Response.json({ error: "Failed to fetch navigation content" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const section = body.section as NavigationSection;
    const itemKey = String(body.itemKey || "");
    const fallback = sections.includes(section) ? getDefault(section, itemKey) : undefined;
    if (!sections.includes(section) || !fallback || typeof body.title !== "string" || typeof body.description !== "string") {
      return Response.json({ error: "Invalid navigation content" }, { status: 400 });
    }

    const existing = await prisma.navigationContent.findUnique({ where: { section_itemKey: { section, itemKey } } });
    const updated = await prisma.navigationContent.upsert({
      where: { section_itemKey: { section, itemKey } },
      create: {
        id: crypto.randomUUID(),
        section,
        itemKey,
        title: body.title.trim(),
        description: body.description.trim(),
        imageUrl: body.imageUrl || fallback.imageUrl,
        imagePath: existing?.imagePath ?? null,
        bucket: existing?.bucket ?? null,
        showTitle: body.showTitle !== false,
        showDescription: body.showDescription !== false,
      },
      update: {
        title: body.title.trim(),
        description: body.description.trim(),
        showTitle: body.showTitle !== false,
        showDescription: body.showDescription !== false,
      },
    });

    return Response.json(updated);
  } catch (error: unknown) {
    console.error("Update navigation content error:", error);
    return Response.json({ error: "Failed to update navigation content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any });
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const section = formData.get("section") as NavigationSection;
    const itemKey = String(formData.get("itemKey") || "");
    const file = formData.get("file") as File | null;
    const fallback = sections.includes(section) ? getDefault(section, itemKey) : undefined;
    if (!fallback || !file || !file.type.startsWith("image/")) {
      return Response.json({ error: "A valid navigation key and image are required" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: "Image is too large. Maximum size is 10MB." }, { status: 400 });
    }

    const existing = await prisma.navigationContent.findUnique({ where: { section_itemKey: { section, itemKey } } });
    const path = `navigation/${section.toLowerCase()}-${itemKey}-${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() || "jpg"}`;
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(path);
    const updated = await prisma.navigationContent.upsert({
      where: { section_itemKey: { section, itemKey } },
      create: {
        id: crypto.randomUUID(),
        section,
        itemKey,
        title: existing?.title ?? fallback.title,
        description: existing?.description ?? fallback.description,
        imageUrl: publicUrl,
        imagePath: path,
        bucket: bucketName,
        showTitle: existing?.showTitle ?? true,
        showDescription: existing?.showDescription ?? true,
      },
      update: { imageUrl: publicUrl, imagePath: path, bucket: bucketName },
    });

    return Response.json(updated, { status: 201 });
  } catch (error: unknown) {
    console.error("Upload navigation image error:", error);
    return Response.json({ error: "Failed to upload navigation image" }, { status: 500 });
  }
}