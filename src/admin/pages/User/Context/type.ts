import { User } from '@shared/types';
import { SWRResponse } from 'swr';

export type UserContext = {
  getUsers: () => SWRResponse<User[]>;
};
