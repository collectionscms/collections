export const allDatabases = ['sqlite3'];
export const testDatabases = process.env.TEST_DB?.split(',').map((v) => v.trim()) ?? [];
