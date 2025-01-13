let started = false;

export default async (): Promise<void> => {
  if (started) return;
  started = true;

  process.env.DATABASE_URL =
    process.env.DATABASE_URL ?? 'postgresql://postgres:pw@localhost:30200/collectionstest';

  console.log('\n\n');
  console.log('🟢 Starting tests! \n');
};
