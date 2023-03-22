import argon2 from 'argon2';
import env from '../../env';

export function oneWayHash(stringToHash: string): Promise<string> {
  const options: Record<string, any> = {
    hashLength: env.HASH_HASH_LENGTH,
    timeCost: env.HASH_TIME_COST,
    memoryCost: env.HASH_MEMORY_COST,
    parallelism: env.HASH_PARALLELISM,
    type: env.HASH_TYPE,
  };

  if (process.env.HASH_ASSOCIATED_DATA) {
    options.associatedData = Buffer.from(env.HASH_ASSOCIATED_DATA);
  }

  return argon2.hash(stringToHash, options);
}
