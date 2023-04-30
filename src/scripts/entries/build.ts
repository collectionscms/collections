import express from 'express';
import { createExpressServer } from '../../server/launch/createExpressServer.js';
import { pathList } from '../../utilities/pathList.js';

(async () => {
  const app = await createExpressServer();

  app.use('/admin', express.static(pathList.build('admin')));
  app.get('/admin/*', (req, res) => {
    res.sendFile(pathList.build('admin', 'index.html'));
  });
})();
