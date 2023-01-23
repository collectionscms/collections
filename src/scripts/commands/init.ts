import fs from 'fs-extra';
import path from 'path';

const scriptInit = async (projectName: string) => {
  const projectDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '../../', 'templates', 'default');

  const requirementsExist = await Promise.all([fs.pathExists(templateDir)]);

  if (!requirementsExist.every((requirement) => requirement === true)) {
    console.error('One of the dependency folders was not found template. Exiting.');
    process.exit(1);
  }

  try {
    await Promise.all([fs.copy(templateDir, projectDir)]);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }

  console.log('Successfully copied files!');
  process.exit(0);
};

export default scriptInit;
