import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";
import { termsAndConditionsSections } from "../lib/legal-content.ts";

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      password: hashed,
      name: "Admin",
    },
    create: {
      email: "admin@gmail.com",
      password: hashed,
      name: "Admin",
    },
  });

  for (const [sectionIndex, section] of termsAndConditionsSections.entries()) {
    await prisma.termsAndConditionsSection.upsert({
      where: { id: `terms-${sectionIndex + 1}` },
      update: { title: section.title, order: sectionIndex + 1, status: "ACTIVE" },
      create: {
        id: `terms-${sectionIndex + 1}`,
        title: section.title,
        order: sectionIndex + 1,
        status: "ACTIVE",
        paragraphs: {
          create: section.paragraphs.map((text, paragraphIndex) => ({
            text,
            order: paragraphIndex + 1,
          })),
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
