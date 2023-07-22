import chalk from 'chalk';
import { rimraf } from 'rimraf';
import webpack from 'webpack';
import { logger } from '../../utilities/logger.js';
import { pathList } from '../../utilities/pathList.js';
import { adminConfigure } from '../../webpack/adminConfigure.js';
import { apiConfigure } from '../../webpack/apiConfigure.js';

export const scriptBuild = async () => {
  rimraf(pathList.build());

  apiConfigure.mode = 'production';
  apiConfigure.entry = pathList.root('scripts', 'entries', 'start.js');
  apiConfigure.output!.path = pathList.build();

  const adminCompiler = webpack(adminConfigure);
  const apiCompiler = webpack(apiConfigure);

  try {
    await compilerRun(adminCompiler);
    await compilerRun(apiCompiler);

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
