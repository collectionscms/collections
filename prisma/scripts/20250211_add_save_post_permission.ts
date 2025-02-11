import { bypassPrisma } from '../../src/api/database/prisma/client.js';

async function main() {
  await bypassPrisma.permission.create({
    data: {
      action: 'savePost',
      group: 'post',
      displayOrder: 1,
    },
  });

  console.log('Success!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
