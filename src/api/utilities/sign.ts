import jwt from 'jsonwebtoken';
import { env } from '../../env.js';
import { AuthUser } from '../config/types.js';

export const sign = (user: AuthUser, expiresIn: number): string => {
  return jwt.sign(user, env.SECRET, {
    expiresIn,
  });
};
