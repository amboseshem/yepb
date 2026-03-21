import "dotenv/config";
import { PrismaClient } from "@prisma/client";

console.log("Starting seed...");

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "Super Admin", code: "super_admin", description: "Full system access" },
    { name: "Admin", code: "admin", description: "Administrative access" },
    { name: "Leader", code: "leader", description: "Leadership access" },
    { name: "Treasurer", code: "treasurer", description: "Finance management access" },
    { name: "Trainer", code: "trainer", description: "Training management access" },
    { name: "Member", code: "member", description: "Regular member access" }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }

  console.log("Roles seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });