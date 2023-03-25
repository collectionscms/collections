import execa from 'execa';
import ora from 'ora';
import path from 'path';
import { copyCommonFiles } from '../utilities/copyCommonFiles';
import { createFirstUser } from '../utilities/createFirstUser';
import Output from '../utilities/output';
import { writeEnvFile } from '../utilities/writeEnvFile';

const scriptInit = async (projectName: string) => {
  const projectDir = path.join(process.cwd(), projectName);

  const onError = ({ err }) => {
    if (err) {
      Output.error(err.message || 'Unknown error');
    }
    process.exit(1);
  };

  try {
    await copyCommonFiles(projectDir, projectName);
  } catch (err) {
    onError({ err });
  }

  try {
    await writeEnvFile(projectDir, 'data');
  } catch (err) {
    onError({ err });
  }

  const spinner = ora('Installing dependencies...').start();

  try {
    await execa('npm', ['install'], { cwd: projectDir });
  } catch (err) {
    onError({ err });
  }

  spinner.stop();

  try {
    await execa('npm', ['run', 'migrate:latest'], {
      cwd: projectDir,
    });
  } catch (err) {
    onError({ err });
  }

  Output.success(`Your database is now in sync with your schema.`);

  try {
    await createFirstUser(projectDir);
  } catch (err) {
    onError({ err });
  }

  process.exit(0);
};

export default scriptInit;
