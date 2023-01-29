import Output from '@scripts/utilities/output';
import chalk from 'chalk';
import fse from 'fs-extra';
import path from 'path';

export const copyCommonFiles = async (projectDir: string, projectName: string): Promise<void> => {
  const templateDir = path.join(__dirname, '../../', 'templates', 'default');
  const prismaDir = path.join(__dirname, '../../../', 'prisma');

  Output.info(`Copy files to directory ${chalk.magentaBright(projectName)}.`);

  // schema.prisma
  await fse.copy(prismaDir, `${projectDir}/prisma`, {
    filter: (dest) => {
      if (dest.indexOf('migrations') == -1 && fse.lstatSync(dest).isDirectory()) {
        return true;
      }
      return dest.indexOf('schema.prisma') > -1;
    },
  });

  // template
  await fse.copy(templateDir, projectDir);
};
