let started = false;

export default async (): Promise<void> => {
  if (started) return;
  started = true;

  console.log('\n\n');
  console.log('🟢 Starting tests! \n');
};
