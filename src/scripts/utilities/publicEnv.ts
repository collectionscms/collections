import { config } from 'dotenv-flow';

config({ silent: true });

export const definePublicEnv = Object.entries(process.env).reduce((values, [key, val]) => {
  if (key.indexOf('PUBLIC_') === 0) {
    return {
      ...values,
      [`process.env.${key}`]: `'${val}'`,
    };
  }

  return values;
}, {});
