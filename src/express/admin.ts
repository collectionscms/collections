import express from 'express';
import { env } from '../env.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initAdminServer = async () => {
  const port = env.ADMIN_PORT;

  const app = express();

  app.listen(port).on('error', (e) => {
    logger.error(e);
    Output.error('Error starting Express');
  });

  return app;
};
