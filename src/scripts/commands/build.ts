import chalk from 'chalk';
import { rimraf } from 'rimraf';
import webpack from 'webpack';
import { logger } from '../../utilities/logger.js';
import { pathList } from '../../utilities/pathList.js';
import { adminConfigure } from '../../webpack/adminConfigure.js';
import { apiConfigure } from '../../webpack/apiConfigure.js';

export const scriptBuild = async () => {
  rimraf(pathList.build());

  const apiCompiler = webpack({
    ...apiConfigure,
    mode: 'production',
    entry: pathList.root('scripts', 'entries', 'start.js'),
  });

  const adminCompiler = webpack({
    ...adminConfigure,
    mode: 'production',
  });

  try {
    await compilerRun(apiCompiler);
    await compilerRun(adminCompiler);

    console.log(chalk.green('✅ Built Successfully'));
  } catch (e) {
    logger.error(e);
  }
};

const compilerRun = (compiler: webpack.Compiler) => {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      return resolve(stats);
    });
  });
};
