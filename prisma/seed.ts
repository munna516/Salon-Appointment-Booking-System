import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@test.com";
  const password = "admin123";
  
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use upsert so we don't accidentally create duplicates if run multiple times
  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log("Database seeded successfully!");
  console.log("Admin User Created:", admin.email);
}

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
