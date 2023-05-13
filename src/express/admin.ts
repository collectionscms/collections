import { Express } from 'express';
import { env } from '../env.js';
import { logger } from '../utilities/logger.js';
import { Output } from '../utilities/output.js';

export const initAdminServer = async (app: Express) => {
  const port = env.ADMIN_PORT;

  app.listen(port).on('error', (e) => {
    logger.error(e);
    Output.error('Error starting Express');
  });
};
