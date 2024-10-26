import argon2 from 'argon2';
import { env } from '../../env.js';

export function oneWayHash(stringToHash: string): Promise<string> {
  const options: Record<string, any> = {
    hashLength: 32,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 1,
    type: 2,
  };

  if (env.HASH_ASSOCIATED_DATA) {
    options.associatedData = Buffer.from(env.HASH_ASSOCIATED_DATA);
  }

  return argon2.hash(stringToHash, options);
}
