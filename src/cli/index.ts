import scriptBuild from '@scripts/build';
import scriptDev from '@scripts/dev';
import scriptStart from '@scripts/start';
import { Command } from 'commander';
import pkg from '../../package.json';

export const createCli = async (): Promise<Command> => {
  const program = new Command();

  program.version(pkg.version, '-v, --version');

  program.command('start').description('Start your Superfast application').action(scriptStart);
  program.command('build').description('Build application').action(scriptBuild);
  program.command('dev').description('Development startup').action(scriptDev);

  return program;
};
