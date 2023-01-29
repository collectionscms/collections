import Output from '@scripts/utilities/output';
import execa from 'execa';
import inquirer from 'inquirer';
import Joi from 'joi';

export const createFirstUser = async (projectDir: string): Promise<void> => {
  Output.info('Create your first admin user');

  const firstUser = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Email',
      default: 'admin@example.com',
      validate: (input: string) => {
        const emailSchema = Joi.string().email().required();
        const { error } = emailSchema.validate(input);
        if (error) throw new Error('The email entered is not a valid email address!');
        return true;
      },
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      mask: '*',
      validate: (input: string | null) => {
        if (input === null || input === '') throw new Error('The password cannot be empty!');
        return true;
      },
    },
  ]);

  await execa(
    'npm',
    ['run', 'seed', 'init', '--', '-e', firstUser.email, '-p', firstUser.password],
    {
      cwd: projectDir,
    }
  );
};
