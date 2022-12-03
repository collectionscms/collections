import PathUtil from '@scripts/utilities/pathUtil';
import Hooks from '@shared/features/hooks';
import { launch } from '@shared/features/server';
import express, { Express } from 'express';
import '../utilities/envUtil';

// Safe to compile as it won't import webpack
(async () => {
  Hooks.addAction(
    'server/init',
    async (app: Express) => {
      app.use('/admin', express.static(PathUtil.build('admin')));
      app.get('/admin/*', (req, res) => {
        res.sendFile(PathUtil.build('admin', 'index.html'));
      });
    },
    { id: 'core/runWebpack' }
  );

  require('../../index');
  await launch();
})();
