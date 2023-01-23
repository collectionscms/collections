import Output from '@scripts/utilities/output';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

const scriptInit = async (projectName: string) => {
  const projectDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '../../', 'templates', 'default');

  const requirementsExist = await Promise.all([fs.pathExists(templateDir)]);

  if (!requirementsExist.every((requirement) => requirement === true)) {
    Output.error('One of the dependency folders was not found template. Exiting.');
    process.exit(1);
  }

  try {
    await Promise.all([fs.copy(templateDir, projectDir)]);
  } catch (e) {
    Output.error(e.message);
    process.exit(1);
  }

  Output.success(`Successfully copied files to directory ${chalk.magentaBright(projectName)}.`);

  process.exit(0);
};

export default scriptInit;
