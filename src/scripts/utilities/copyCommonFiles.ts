import Output from '@scripts/utilities/output';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';

export const copyCommonFiles = async (projectDir: string, projectName: string): Promise<void> => {
  const templateDir = path.join(__dirname, '../../', 'templates', 'default');

  Output.info(`Copy files to directory ${chalk.magentaBright(projectName)}.`);

  // template
  await fse.copy(templateDir, projectDir);
};
