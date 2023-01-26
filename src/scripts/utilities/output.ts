import chalk from 'chalk';

const Output = {
  success: (...output: any[]) => console.log(`✅ `, ...output),
  error: (...output: any[]) => console.log(`❌ `, ...output),
  info: (...output: any[]) => console.log(chalk.blue(...output)),
};

export default Output;
