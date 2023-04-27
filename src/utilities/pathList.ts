import path from 'path';
import { env } from '../env.js';

export const pathList = {
  root: (...args: string[]) => path.join(env.ROOT_DIR, ...args),
  buildRoot: (...args: string[]) => path.join(process.cwd(), 'dist', ...args),
  admin: (...args: string[]) =>
    process.env.ADMIN_PATH
      ? path.join(process.env.ADMIN_PATH, ...args)
      : pathList.root('admin', ...args),
  build: (...args: string[]) => pathList.buildRoot('build', ...args),
  devBuild: (...args: string[]) => pathList.buildRoot('.dev-build', ...args),
};
