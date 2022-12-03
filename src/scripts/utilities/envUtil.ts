import { config } from 'dotenv-flow';
import _ from 'lodash';

config({ silent: true });
const env = process.env;

const envDefaults = {
  SERVER_PORT: '4000',
  ADMIN_PORT: '4001',
};

Object.keys(envDefaults).forEach((key) => {
  if (env?.[key] === undefined) {
    env[key] = envDefaults[key];
  }
});

const defineAllEnv = () =>
  _.mapValues(
    _.mapKeys(env, (value, key) => `process.env.${key}`),
    JSON.stringify
  );
const definePublicEnv = () =>
  _.pickBy(defineAllEnv(), (value, key) => _.startsWith(key, 'process.env.PUBLIC_'));

export { definePublicEnv, defineAllEnv };
