import { v4 } from 'uuid';

export const generateKey = () => {
  return v4().trim().replace(/-/g, '').substring(0, 10);
};
