import { Prisma, PrismaClient } from '@prisma/client';
import { Command } from 'commander';

const program = new Command();
const prisma = new PrismaClient();

const runSeed = async (email: string, password: string) => {
  // role
  const roleData: Prisma.Superfast_RoleCreateInput = {
    name: 'Administrator',
    description: 'Administrator',
    adminAccess: true,
  };

  const adminRole = await prisma.superfast_Role.create({
    data: roleData,
  });

  // user
  const userData: Prisma.Superfast_UserCreateInput = {
    firstName: 'Admin',
    lastName: 'User',
    userName: 'admin',
    email: email,
    password: password,
    isActive: true,
    superfast_Role: { connect: { id: adminRole!.id } },
  };

  await prisma.superfast_User.create({
    data: userData,
  });
};

const init = async (options: { email: string; password: string }) => {
  const email = options.email.trim();
  const password = options.password.trim();

  runSeed(email, password).finally(async () => {
    await prisma.$disconnect();
  });
};

program
  .command('init')
  .description('Insert initial data your Superfast application')
  .requiredOption('-e, --email <email>', 'email option')
  .requiredOption('-p, --password <name>', 'password option')
  .action(init);

program.parseAsync(process.argv);
