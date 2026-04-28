import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const employee = await db.employee.upsert({
    where: { email: 'admin@kingpinlogistics.com' },
    update: { password: hashedPassword, role: 'EMPLOYEE' },
    create: {
      email: 'admin@kingpinlogistics.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });
  console.log('Upserted employee:', employee.email);
}

main().catch(console.error).finally(() => db.$disconnect());
