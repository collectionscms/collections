#!/usr/bin/env node
import buildScript from '@scripts/commands/build';
import devScript from '@scripts/commands/dev';
import initScript from '@scripts/commands/init';
import startScript from '@scripts/commands/start';
import migrate from '@server/database/migrate';
import seedDev from '@server/database/seeds/dev';
import seedProduction from '@server/database/seeds/production';
import { Command } from 'commander';
import packageJSON from '../package.json';

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

const runSeed = async (str) => {
  const email = str.email.trim();
  const password = str.password.trim();
  await seedProduction(email, password);
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

const dbCommand = program.command('database');
dbCommand
  .command('migrate:up')
  .description('Upgrade the database')
  .action(() => migrate('up'));
dbCommand
  .command('migrate:down')
  .description('Downgrade the database')
  .action(() => migrate('down'));
dbCommand
  .command('migrate:latest')
  .description('Upgrade the database')
  .action(() => migrate('latest'));
dbCommand
  .command('seed:dev')
  .description('Inserting seed data')
  .action(() => seedDev());
dbCommand
  .command('seed:production')
  .description('Inserting seed data')
  .requiredOption('-e, --email <email>', 'email option')
  .requiredOption('-p, --password <password>', 'password option')
  .action(runSeed);

program.parseAsync(process.argv);
