const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const employees = await prisma.employee.findMany();
  console.log('Users:', users);
  console.log('Employees:', employees);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
