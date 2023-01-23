#!/usr/bin/env node
import { Command } from 'commander';
import packageJSON from '../package.json';
import initScript from '@scripts/commands/init';
import startScript from '@scripts/commands/start';
import buildScript from '@scripts/commands/build';
import devScript from '@scripts/commands/dev';

const program = new Command();

const init = async (str) => {
  await initScript(str.projectName.trim());
};

const start = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
  await startScript();
};

const build = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
  await buildScript();
};

const dev = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
  await devScript();
};

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

// `$ superfast version` (--version synonym)
program.version(packageJSON.version, '-v, --version', 'Output the version number');

program
  .command('version')
  .description('Output your version of Superfast')
  .action(() => {
    process.stdout.write(`${packageJSON.version}\n`);
    process.exit(0);
  });

program
  .command('init')
  .description('Initialize your Superfast application')
  .requiredOption('-p, --project-name <name>', 'project name option')
  .action(init);
program.command('start').description('Start your Superfast application').action(start);
program.command('build').description('Build your Superfast application').action(build);
program.command('dev').description('Develop your Superfast server').action(dev);

program.parseAsync(process.argv);
