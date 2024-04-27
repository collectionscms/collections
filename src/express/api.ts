import boxen from 'boxen';
import chalk from 'chalk';
import { Express } from 'express';
import { errorHandler } from '../api/middlewares/errorHandler.js';
import { asset } from '../api/routes/asset.router.js';
import { router } from '../api/routes/index.js';
import { env } from '../env.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initApiServer = async (app: Express) => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;

  app.use('/', asset);
  app.use('/api', router);
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
