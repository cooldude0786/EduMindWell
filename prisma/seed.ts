import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password: hashed,
      name: "Admin",
    },
  });
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