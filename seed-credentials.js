const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default credentials...');
  
  // Seed employee/admin
  const adminEmail = 'admin@kingpin.com';
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const employee = await prisma.employee.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    }
  });
  console.log('Created Admin:', employee.email);

  // Seed user
  const userEmail = 'user@kingpin.com';
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: { password: userPassword },
    create: {
      email: userEmail,
      name: 'Test User',
      password: userPassword,
      company: 'Logistics Co'
    }
  });
  console.log('Created User:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
