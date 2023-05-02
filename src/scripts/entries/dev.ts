import httpProxy from 'http-proxy';
import { env } from '../../env.js';
import { createExpressServer } from '../../server/launch/createExpressServer.js';
import { logger } from '../../utilities/logger.js';

(async () => {
  const app = await createExpressServer();
  const proxy = httpProxy.createProxyServer();

  app.get(['/admin/*', '/admin'], (req, res) => {
    proxy.web(req, res, { target: `http://localhost:${env.ADMIN_PORT}/` }, (e) => {
      logger.error(e);
    });
  });
})();
