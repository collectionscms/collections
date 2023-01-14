import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // リセット
  await prisma.superfast_Permission.deleteMany();
  await prisma.superfast_User.deleteMany();
  await prisma.superfast_Role.deleteMany();

  // Role作成
  const roleData: Prisma.Superfast_RoleCreateInput[] = [
    {
      name: 'Administrator',
      description: '管理者',
      adminAccess: true,
    },
    {
      name: 'Editor',
      description: '編集者',
      adminAccess: false,
    },
  ];

  console.log('Creating users...');
  for (const data of roleData) {
    await prisma.superfast_Role.create({
      data,
    });
  }
  console.log('Created Users!');

  // User作成
  const adminRole = await prisma.superfast_Role.findUnique({
    where: {
      name: 'Administrator',
    },
  });

  const editorRole = await prisma.superfast_Role.findUnique({
    where: {
      name: 'Editor',
    },
  });
  const userData: Prisma.Superfast_UserCreateInput[] = [
    {
      firstName: '花子',
      lastName: '山田',
      userName: 'hanako',
      email: 'hanako-yamada@example.com',
      password: 'hanako-xxxxxxxxx',
      isActive: true,
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      firstName: '太郎',
      lastName: '田中',
      userName: 'taro',
      email: 'taro-tanaka@example.com',
      password: 'taro-xxxxxxxxx',
      isActive: true,
      superfast_Role: { connect: { id: editorRole!.id } },
    },
  ];

  console.log('Creating Roles...');
  for (const data of userData) {
    await prisma.superfast_User.create({
      data,
    });
  }
  console.log('Created Roles!');

  // Permission作成
  const permissionData: Prisma.Superfast_PermissionCreateInput[] = [
    // 管理者
    {
      collection: 'Restraunt',
      action: 'read',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restraunt',
      action: 'create',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restraunt',
      action: 'update',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Menu',
      action: 'read',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Menu',
      action: 'create',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Menu',
      action: 'update',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    // エディター
    {
      collection: 'Restraunt',
      action: 'read',
      superfast_Role: { connect: { id: editorRole!.id } },
    },
    {
      collection: 'Menu',
      action: 'read',
      superfast_Role: { connect: { id: editorRole!.id } },
    },
  ];

  console.log('Creating Permissions...');
  for (const data of permissionData) {
    await prisma.superfast_Permission.create({
      data,
    });
  }
  console.log('Created Permissions!');

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
