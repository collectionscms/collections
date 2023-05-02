import fs from 'fs-extra';
import { pathList } from '../../utilities/pathList.js';

export const scriptStart = async () => {
  const scriptPath = pathList.build('main.js');
  const scriptExists = await fs.pathExists(scriptPath);

  if (!scriptExists) {
    process.exit(1);
  }

  import(scriptPath);
};
