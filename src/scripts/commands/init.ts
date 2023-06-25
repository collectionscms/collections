import { execa } from 'execa';
import ora from 'ora';
import path from 'path';
import process from 'process';
import { Output } from '../../utilities/output.js';
import { chooseDatabase } from '../operations/chooseDatabase.js';
import { copyCommonFiles } from '../operations/copyCommonFiles.js';
import { createFirstUser } from '../operations/createFirstUser.js';
import { makeCredentials } from '../operations/makeCredentials.js';
import { writeEnvFile } from '../operations/writeEnvFile.js';

export const scriptInit = async (projectName: string) => {
  const projectDir = path.join(process.cwd(), projectName);

  const onError = (err: any) => {
    if (err) {
      Output.error(err.message || 'Unknown error');
    }
    process.exit(1);
  };

  try {
    await copyCommonFiles(projectDir, projectName);
  } catch (err) {
    onError(err);
  }

  try {
    const dbClient = await chooseDatabase();
    const credentials = await makeCredentials(dbClient, projectDir);

    // write env file
    await writeEnvFile(projectDir, dbClient, credentials);

    const spinner = ora('Installing dependencies...').start();

    // install database driver and dependencies
    await execa('npm', ['install', dbClient, '--production'], { cwd: projectDir });
    await execa('npm', ['install'], { cwd: projectDir });

    spinner.stop();
  } catch (err) {
    onError(err);
  }

  try {
    await execa('npm', ['run', 'migrate:latest'], {
      cwd: projectDir,
    });
  } catch (err) {
    onError(err);
  }

  Output.success(`Your database is now in sync with your schema.`);

  try {
    await createFirstUser(projectDir);
  } catch (err) {
    onError(err);
  }

  process.exit(0);
};
