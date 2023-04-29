import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { Output } from '../../utilities/output.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const copyCommonFiles = async (projectDir: string, projectName: string): Promise<void> => {
  const templateDir = path.join(__dirname, '../../', 'templates', 'default');

  Output.info(`Copy files to directory ${chalk.magentaBright(projectName)}.`);

  // template
  await fse.copy(templateDir, projectDir);
};
