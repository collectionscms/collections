#!/usr/bin/env node
import { Command } from 'commander';
import { seedDev } from './api/database/seeds/dev.js';
import { scriptBuild } from './scripts/commands/build.command.js';
import { scriptDev } from './scripts/commands/dev.command.js';
import { scriptStart } from './scripts/commands/start.command.js';

const program = new Command();

const dev = async () => {
  await scriptDev();
};

const build = async () => {
  await scriptBuild();
};

const start = async () => {
  await scriptStart();
};

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.command('start').description('Start your application').action(start);
program.command('build').description('Build your application').action(build);
program.command('dev').description('Start your development server').action(dev);

const dbCommand = program.command('database');
dbCommand
  .command('seed:dev')
  .description('Inserting seed data')
  .action(() => seedDev());

program.parseAsync(process.argv);
