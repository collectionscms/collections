import argon2 from 'argon2';

export const comparePasswords = async (hashed: string, plain: string): Promise<boolean> => {
  return await argon2.verify(hashed, plain);
};
