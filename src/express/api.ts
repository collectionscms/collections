import chalk from 'chalk';
import express from 'express';
import { env } from '../env.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';
import { assets } from '../server/controllers/assets.js';
import { errorHandler } from '../server/middleware/errorHandler.js';
import { apiRouter } from '../server/router/apiRouter.js';

export const initApiServer = async () => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;

  const app = express();
  app.use('/', assets);
  app.use('/api', apiRouter);
  app.use(errorHandler);

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
