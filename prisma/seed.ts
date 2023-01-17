import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // リセット
  await prisma.superfast_Permission.deleteMany();
  await prisma.superfast_User.deleteMany();
  await prisma.superfast_Role.deleteMany();
  await prisma.superfast_Collection.deleteMany();
  await prisma.superfast_FieldOption.deleteMany();
  await prisma.superfast_Relation.deleteMany();
  await prisma.superfast_Field.deleteMany();
  await prisma.$queryRaw`DROP TABLE IF EXISTS Restaurant;`;

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
      collection: 'Restaurant',
      action: 'read',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restaurant',
      action: 'create',
      superfast_Role: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restaurant',
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
      collection: 'Restaurant',
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

  // Collection作成
  const collectionData: Prisma.Superfast_CollectionCreateInput[] = [
    {
      collection: 'Restaurant',
      singleton: false,
      hidden: false,
    },
    {
      collection: 'Company',
      singleton: false,
      hidden: false,
    },
  ];

  console.log('Creating Collections...');
  for (const data of collectionData) {
    await prisma.superfast_Collection.create({
      data,
    });
  }
  console.log('Created Collections!');

  // Field作成
  const fieldData: Prisma.Superfast_FieldCreateInput[] = [
    // Collection Restaurantに紐づくフィールド
    {
      collection: 'Restaurant',
      field: 'name',
      label: '名前',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 1,
      Superfast_FieldOption: { create: [{ key: 'length', value: '100' }] },
    },
    {
      collection: 'Restaurant',
      field: 'nick_name',
      label: 'ニックネーム',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
      Superfast_FieldOption: { create: [{ key: 'length', value: '200' }] },
    },
    {
      collection: 'Restaurant',
      field: 'adress',
      label: '住所',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
      Superfast_FieldOption: { create: [{ key: 'length', value: '300' }] },
    },
    // Collection Companyに紐づくフィールド
    {
      collection: 'Company',
      field: 'name',
      label: '会社名',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 1,
      Superfast_FieldOption: { create: [{ key: 'length', value: '100' }] },
    },
    {
      collection: 'Company',
      field: 'phone_number',
      label: '電話番号',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 2,
      Superfast_FieldOption: { create: [{ key: 'length', value: '200' }] },
    },
    {
      collection: 'Company',
      field: 'adress',
      label: '住所',
      special: 'one 2 many',
      interface: 'input',
      readonly: false,
      required: false,
      hidden: false,
      sort: 3,
      Superfast_FieldOption: { create: [{ key: 'length', value: '300' }] },
    },
  ];
  console.log('Creating Fields...');
  for (const data of fieldData) {
    await prisma.superfast_Field.create({
      data,
    });
  }
  console.log('Created Fields!');

  // Relation作成
  const relationData: Prisma.Superfast_RelationCreateInput[] = [
    {
      many_collection: 'Menu',
      many_field: 'memu_id',
      one_collection: 'Restaurant',
      one_field: 'relational_one_to_many',
    },
  ];
  console.log('Creating Relations...');
  for (const data of relationData) {
    await prisma.superfast_Relation.create({
      data,
    });
  }
  console.log('Created Relations!');

  // Restaurant作成(動的なコレクションテーブル)
  console.log('Creating Restaurant Table...');
  await prisma.$queryRaw`CREATE TABLE Restaurant (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "action" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
  console.log('Created Restaurant Table!');

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
