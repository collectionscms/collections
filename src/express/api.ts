import boxen from 'boxen';
import chalk from 'chalk';
import { Express } from 'express';
import { assets } from '../api/controllers/assets.js';
import { errorHandler } from '../api/middleware/errorHandler.js';
import { schemaOverview } from '../api/middleware/schemaOverview.js';
import { apiRouter } from '../api/router/apiRouter.js';
import { env } from '../env.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initApiServer = async (app: Express) => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;

  app.use(schemaOverview);
  app.use('/', assets);
  app.use('/api', apiRouter);
  app.use(errorHandler);

  app
    .listen(port, () => {
      let message = chalk.green('Starting!');
      message += `\n\n${chalk.bold('- API:')}    ${host}:${port}`;
      message += `\n${chalk.bold('- Admin:')}  ${host}:${port}/admin`;

      console.log(
        boxen(message, {
          padding: 1,
          borderColor: 'green',
          margin: 1,
        })
      );
    })
    .on('error', (e) => {
      logger.error(e);
      Output.error('Error starting Express');
    });
};
