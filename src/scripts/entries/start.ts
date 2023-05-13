import express from 'express';
import { initApiServer } from '../../express/api.js';
import { pathList } from '../../utilities/pathList.js';

(async () => {
  const app = await initApiServer();

  app.use('/admin', express.static(pathList.build('admin')));
  app.get('/admin/*', (_req, res) => {
    res.sendFile(pathList.build('admin', 'index.html'));
  });
})();
