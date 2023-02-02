import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // リセット
  await prisma.superfastPermission.deleteMany();
  await prisma.superfastUser.deleteMany();
  await prisma.superfastRole.deleteMany();
  await prisma.superfastCollection.deleteMany();
  await prisma.superfastFieldOption.deleteMany();
  await prisma.superfastRelation.deleteMany();
  await prisma.superfastField.deleteMany();
  await prisma.$queryRaw`DROP TABLE IF EXISTS Restaurant;`;
  await prisma.$queryRaw`DROP TABLE IF EXISTS Company;`;

  // Role作成
  const roleData: Prisma.SuperfastRoleCreateInput[] = [
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
    await prisma.superfastRole.create({
      data,
    });
  }
  console.log('Created Users!');

  // User作成
  const adminRole = await prisma.superfastRole.findUnique({
    where: {
      name: 'Administrator',
    },
  });

  const editorRole = await prisma.superfastRole.findUnique({
    where: {
      name: 'Editor',
    },
  });
  const userData: Prisma.SuperfastUserCreateInput[] = [
    {
      firstName: '花子',
      lastName: '山田',
      userName: 'hanako',
      email: 'hanako-yamada@example.com',
      password: 'hanako-xxxxxxxxx',
      isActive: true,
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      firstName: '太郎',
      lastName: '田中',
      userName: 'taro',
      email: 'taro-tanaka@example.com',
      password: 'taro-xxxxxxxxx',
      isActive: true,
      superfastRole: { connect: { id: editorRole!.id } },
    },
  ];

  console.log('Creating Roles...');
  for (const data of userData) {
    await prisma.superfastUser.create({
      data,
    });
  }
  console.log('Created Roles!');

  // Permission作成
  const permissionData: Prisma.SuperfastPermissionCreateInput[] = [
    // 管理者
    {
      collection: 'Restaurant',
      action: 'read',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restaurant',
      action: 'create',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Restaurant',
      action: 'update',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Company',
      action: 'read',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Company',
      action: 'create',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    {
      collection: 'Company',
      action: 'update',
      superfastRole: { connect: { id: adminRole!.id } },
    },
    // エディター
    {
      collection: 'Restaurant',
      action: 'read',
      superfastRole: { connect: { id: editorRole!.id } },
    },
    {
      collection: 'Company',
      action: 'read',
      superfastRole: { connect: { id: editorRole!.id } },
    },
  ];

  console.log('Creating Permissions...');
  for (const data of permissionData) {
    await prisma.superfastPermission.create({
      data,
    });
  }
  console.log('Created Permissions!');

  // Collection作成
  const collectionData: Prisma.SuperfastCollectionCreateInput[] = [
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
    await prisma.superfastCollection.create({
      data,
    });
  }
  console.log('Created Collections!');

  // Field作成
  const fieldData: Prisma.SuperfastFieldCreateInput[] = [
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
      superfastFieldOptions: { create: [{ key: 'length', value: '100' }] },
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
      superfastFieldOptions: { create: [{ key: 'length', value: '200' }] },
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
      superfastFieldOptions: { create: [{ key: 'length', value: '300' }] },
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
      superfastFieldOptions: { create: [{ key: 'length', value: '100' }] },
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
      superfastFieldOptions: { create: [{ key: 'length', value: '200' }] },
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
      superfastFieldOptions: { create: [{ key: 'length', value: '300' }] },
    },
  ];
  console.log('Creating Fields...');
  for (const data of fieldData) {
    await prisma.superfastField.create({
      data,
    });
  }
  console.log('Created Fields!');

  // Relation作成
  const relationData: Prisma.SuperfastRelationCreateInput[] = [
    {
      many_collection: 'Restaurant',
      many_field: 'restaurant_id',
      one_collection: 'Company',
      one_field: 'relational_one_to_many',
    },
  ];
  console.log('Creating Relations...');
  for (const data of relationData) {
    await prisma.superfastRelation.create({
      data,
    });
  }
  console.log('Created Relations!');

  // Restaurant作成(動的なコレクションテーブル)
  console.log('Creating Restaurant Table...');
  await prisma.$queryRaw`CREATE TABLE Restaurant (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
  console.log('Created Restaurant Table!');

  // Company作成(動的なコレクションテーブル)
  console.log('Creating Company Table...');
  await prisma.$queryRaw`CREATE TABLE Company (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`;
  console.log('Created Company Table!');

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
