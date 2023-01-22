import chalk from 'chalk';
import ConsoleOutput from '../utilities/consoleOutputUtil';
import PathUtil from '../utilities/pathUtil';
import fs from 'fs-extra';

const scriptStart = async () => {
  const scriptPath = PathUtil.build('main.js');
  const scriptExists = await fs.pathExists(scriptPath);

  if (!scriptExists) {
    ConsoleOutput.error(
      `Build has not been found. Try running ${chalk.magentaBright(
        'npx superfastcms build'
      )} before.`
    );
    process.exit(1);
  }

  require(scriptPath);
};

export default scriptStart;
