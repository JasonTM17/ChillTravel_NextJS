import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../packages/db/generated/client/client";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://vietwander:vietwander@localhost:5433/vietwander";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const result = await prisma.tourImage.deleteMany();
  console.log(`Deleted ${result.count} old tour images`);
  await prisma.$disconnect();
}

main().catch(console.error);
