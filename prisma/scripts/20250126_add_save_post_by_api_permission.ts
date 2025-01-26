import { bypassPrisma } from '../../src/api/database/prisma/client.js';

async function main() {
  await bypassPrisma.permission.create({
    data: {
      action: 'savePostByApi',
      group: 'post',
      displayOrder: 1,
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
