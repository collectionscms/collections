import chalk from 'chalk';

export const Output = {
  info: (...output: any[]) => console.log(`✨ `, ...output),
  success: (...output: any[]) => console.log(`⭐️ `, chalk.green(...output)),
  error: (...output: any[]) => console.log(`❌ `, chalk.red(...output)),
};
