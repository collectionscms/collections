import httpProxy from 'http-proxy';
import { env } from '../../env.js';
import { initApiServer } from '../../express/api.js';
import { logger } from '../../utilities/logger.js';

(async () => {
  const app = await initApiServer();
  const proxy = httpProxy.createProxyServer();

  app.get(['/admin/*', '/admin'], (req, res) => {
    proxy.web(req, res, { target: `http://localhost:${env.ADMIN_PORT}/` }, (e) => {
      logger.error(e);
    });
  });
})();
