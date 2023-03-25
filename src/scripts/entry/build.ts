import express, { Express } from 'express';
import Hooks from '../../shared/features/hooks';
import { launch } from '../../shared/features/server';
import '../utilities/envUtil';
import PathUtil from '../utilities/pathUtil';

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
