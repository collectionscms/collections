import express from 'express';
import httpProxy from 'http-proxy';
import { env } from '../../env.js';
import { initApiServer } from '../../express/api.js';
import { logger } from '../../utilities/logger.js';

const app = express();

await initApiServer(app);

app.get(['/admin/*', '/admin'], (req, res) => {
  const proxy = httpProxy.createProxyServer();
  proxy.web(req, res, { target: `http://localhost:${env.ADMIN_PORT}/` }, (e) => {
    logger.error(e);
  });
});
