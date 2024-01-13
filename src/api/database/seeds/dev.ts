import { Output } from '../../../utilities/output.js';
import { createProjectSetting } from './createProjectSetting.js';

export const seedDev = async (): Promise<void> => {
  try {
    await createProjectSetting();

    process.exit(0);
  } catch (e) {
    Output.error(e);
    process.exit(1);
  }
};
