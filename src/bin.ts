#!/usr/bin/env node
import { Command } from 'commander';
import { scriptBuild } from './scripts/commands/build.js';
import { scriptDev } from './scripts/commands/dev.js';
import { scriptStart } from './scripts/commands/start.js';
import { scriptInit } from './scripts/commands/init.js';
import { migrate } from './server/database/migrate.js';
import { seedDev } from './server/database/seeds/dev.js';
import { seedProduction } from './server/database/seeds/production.js';

const program = new Command();

const init = async (options: { projectName: string }) => {
  await scriptInit(options.projectName.trim());
};

const dev = async () => {
  await scriptDev();
};

const build = async () => {
  await scriptBuild();
};

const start = async () => {
  await scriptStart();
};

const runSeed = async (options: { email: string; password: string }) => {
  const email = options.email.trim();
  const password = options.password.trim();
  await seedProduction(email, password);
};

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

program
  .command('init')
  .description('Initialize your application')
  .requiredOption('-p, --project-name <name>', 'project name option')
  .action(init);
program.command('start').description('Start your application').action(start);
program.command('build').description('Build your application').action(build);
program.command('dev').description('Start your development server').action(dev);

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
