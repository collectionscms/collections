import argon2 from 'argon2';

export function oneWayHash(stringToHash: string): Promise<string> {
  const options: Record<string, any> = {
    hashLength: process.env.HASH_HASH_LENGTH,
    timeCost: process.env.HASH_TIME_COST,
    memoryCost: process.env.HASH_MEMORY_COST,
    parallelism: process.env.HASH_PARALLELISM,
    type: process.env.HASH_TYPE,
  };

  if (process.env.HASH_ASSOCIATED_DATA) {
    options.associatedData = Buffer.from(process.env.HASH_ASSOCIATED_DATA);
  }

  return argon2.hash(stringToHash, options);
}
