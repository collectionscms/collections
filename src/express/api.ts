import chalk from 'chalk';
import { Express } from 'express';
import { env } from '../env.js';
import { assets } from '../api/controllers/assets.js';
import { errorHandler } from '../api/middleware/errorHandler.js';
import { apiRouter } from '../api/router/apiRouter.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initApiServer = async (app: Express) => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;

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
};
