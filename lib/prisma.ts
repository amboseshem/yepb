let prisma: any;

if (process.env.NODE_ENV === "production") {
  // In build time, avoid crashing
  prisma = {
    user: {},
    memberProfile: {},
    branch: {},
    contribution: {},
    commission: {},
    project: {},
  };
} else {
  const { PrismaClient } = require("@prisma/client");

  const globalForPrisma = globalThis as any;

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
