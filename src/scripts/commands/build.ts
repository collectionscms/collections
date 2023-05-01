import chalk from 'chalk';
import { rimraf } from 'rimraf';
import webpack from 'webpack';
import { logger } from '../../utilities/logger.js';
import { pathList } from '../../utilities/pathList.js';
import { adminConfigure } from '../../webpack/adminConfigure.js';
import { serverConfigure } from '../../webpack/serverConfigure.js';

export const scriptBuild = async () => {
  rimraf(pathList.build());

  serverConfigure.mode = 'production';
  serverConfigure.entry = pathList.root('scripts', 'entries', 'build.js');
  serverConfigure.output!.path = pathList.build();

  const compiler = webpack(adminConfigure);
  const serverCompiler = webpack(serverConfigure);

  try {
    await compilerRun(serverCompiler);
    await compilerRun(compiler);

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
