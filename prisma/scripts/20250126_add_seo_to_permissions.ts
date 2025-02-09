import { bypassPrisma } from '../../src/api/database/prisma/client.js';

async function main() {
  await bypassPrisma.permission.createMany({
    data: [
      {
        action: 'readSeo',
        group: 'project',
        displayOrder: 2,
      },
      {
        action: 'saveSeo',
        group: 'project',
        displayOrder: 3,
      },
    ],
  });

  console.log('Success!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
