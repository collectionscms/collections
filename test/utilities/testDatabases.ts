export const allDatabases = ['postgres'];
export const testDatabases = process.env.TEST_DB?.split(',').map((v) => v.trim()) ?? allDatabases;
