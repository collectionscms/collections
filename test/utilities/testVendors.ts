export const testVendors = process.env.TEST_DB?.split(',').map((v) => v.trim()) ?? [];
