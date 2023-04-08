import { Express } from 'express';
import httpProxy from 'http-proxy';
import env from '../../env';
import Hooks from '../../shared/features/hooks';
import { launch } from '../../shared/features/server';

(async () => {
  Hooks.addAction(
    'server/init',
    async (app: Express) => {
      const proxy = httpProxy.createProxyServer();

      app.get(['/admin/*', '/admin'], (req, res) => {
        proxy.web(req, res, { target: `http://localhost:${env.ADMIN_PORT}/` }, (err) => {
          console.error(err);
        });
      });
    },
    { id: 'core/runWebpack' }
  );

  require('../../index');
  await launch();
})();
