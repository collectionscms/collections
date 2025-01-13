import boxen from 'boxen';
import chalk from 'chalk';
import express, { Express } from 'express';
import vhost from 'vhost';
import { currentSession, extractToken } from '../api/middlewares/auth.js';
import { corsMiddleware } from '../api/middlewares/cors.js';
import { errorHandler } from '../api/middlewares/errorHandler.js';
import { asset } from '../api/routes/asset.router.js';
import { portalApiRouter } from '../api/routes/portal.router.js';
import { tenantApiRouter } from '../api/routes/tenant.router.js';
import { tenantPublicApiRouter } from '../api/routes/tenantPublic.router.js';
import { env } from '../env.js';
import { expressLogger } from '../utilities/expressLogger.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initApiServer = async (app: Express) => {
  const port = env.SERVER_PORT;
  const host = env.SERVER_HOST;
  const subdomain = env.PUBLIC_PORTAL_SUBDOMAIN;

  if (Boolean(env.CORS_ENABLED) === true) {
    app.use(corsMiddleware);
  }

  app.use(express.json({ limit: env.REQ_LIMIT }));
  app.use(express.urlencoded({ limit: env.REQ_LIMIT, extended: true }));
  app.use(expressLogger);
  app.use(extractToken);
  app.use(currentSession);

  // api
  const portalApp = express();
  portalApp.use('/api', portalApiRouter);
  app.use(vhost(`${subdomain}.*.*`, portalApp));

  const tenantApp = express();
  tenantApp.use('/api', tenantApiRouter);
  tenantApp.use('/api/v1', tenantPublicApiRouter);
  app.use(vhost('*.*.*', tenantApp));

  app.use('/', asset);

  // Description here to handle api errors.
  app.use(errorHandler);

  app
    .listen(port, () => {
      let message = chalk.green('Starting!');
      message += `\n\n${chalk.bold('- API:')}    ${subdomain}.${host}:${port}`;
      message += `\n${chalk.bold('- Admin:')}  ${subdomain}.${host}:${port}/admin`;

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
