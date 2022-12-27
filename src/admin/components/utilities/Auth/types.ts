import { User } from 'config/types';

export type AuthContext<T = User> = {
  user?: T | null;
  token?: string;
};
