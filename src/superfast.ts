#!/usr/bin/env node
import ConsoleOutput from '@scripts/utilities/consoleOutputUtil';
import PathUtil from '@scripts/utilities/pathUtil';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import packageJSON from '../package.json';

const program = new Command();

const start = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
  const scriptPath = PathUtil.build('main.js');
  const scriptExists = await fs.pathExists(scriptPath);

  if (!scriptExists) {
    ConsoleOutput.error(
      `Build has not been found. Try running ${chalk.magentaBright('superfast build')} before.`
    );
    process.exit(1);
  }

  require(scriptPath);
};

const build = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
  await require('@scripts/build').default();
};

const dev = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
  await require('@scripts/dev').default();
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

program.command('start').description('Start your Superfast application').action(start);
program.command('build').description('Build your Superfast application').action(build);
program.command('dev').description('Develop your Superfast server').action(dev);

program.parseAsync(process.argv);
