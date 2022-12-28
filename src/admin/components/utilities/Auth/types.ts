import { User } from '@shared/types';

export type AuthContext<T = User> = {
  user?: T | null;
  token?: string;
};
