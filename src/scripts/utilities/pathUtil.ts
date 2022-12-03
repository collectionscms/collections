import path from 'path';
import fse from 'fs-extra';
import environment from '../../env';

const PathUtil = {
  exists: (path: string) => fse.existsSync(path),
  root: (...args: string[]) => path.join(environment.rootDir, ...args),
  admin: (...args: string[]) =>
    process.env.ADMIN_PATH
      ? path.join(process.env.ADMIN_PATH, ...args)
      : PathUtil.root('admin', ...args),
  processRoot: (...args: string[]) => path.join(process.cwd(), ...args),
  superfastRoot: (...args: string[]) => PathUtil.processRoot('superfast', ...args),
  cache: (...args: string[]) => PathUtil.superfastRoot('.cache', ...args),
  projectRoot: (...args: string[]) => PathUtil.processRoot('project', ...args),
  build: (...args: string[]) => PathUtil.superfastRoot('build', ...args),
  devBuild: (...args: string[]) => PathUtil.superfastRoot('.dev-build', ...args),
  plugins: (...args: string[]) => PathUtil.superfastRoot('plugins', ...args),
};

export default PathUtil;
