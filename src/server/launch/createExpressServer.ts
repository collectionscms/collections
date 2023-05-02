import chalk from 'chalk';
import express from 'express';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';
import { Output } from '../../utilities/output.js';
import { attachApiListener } from './attachApiListener.js';

export const createExpressServer = async () => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;

  const app = express();

  const apiApp = express();
  attachApiListener(apiApp);

  app.use('/api', apiApp);

  app
    .listen(port, () => {
      console.log(chalk.green(`🚀 Server ready at ${host}:${port}`));
      console.log(chalk.green(`🚀 Admin UI ready at ${host}:${port}/admin`));
    })
    .on('error', (e) => {
      logger.error(e);
      Output.error('Error starting Express');
    });

  return app;
};
