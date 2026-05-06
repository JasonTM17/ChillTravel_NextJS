import { destinations, demoAccounts } from "@vietwander/shared";

console.log("Seed preview for VIETWANDER AI");
console.log("Destinations:", destinations.length);
console.log("Demo accounts:", demoAccounts.map((account) => account.email).join(", "));
console.log("Use Prisma Client generation after installing PostgreSQL and running migrations.");
