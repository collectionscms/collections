import express from 'express';
import Hooks from './hooks';

const launchApi = async () => {
  const app = express();
  await Hooks.doAction('api/init', app);

  return app;
};

export { launchApi };
