import * as Sentry from '@sentry/node';
import express from 'express';
import helmet from 'helmet';
import { env } from '../../env.js';
import { initApiServer } from '../../express/api.js';
import { pathList } from '../../utilities/pathList.js';

const app = express();

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    release: `collections@${env.npm_package_version}`,
    dist: env.npm_package_version,
  });
  Sentry.setupExpressErrorHandler(app);
}

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", '*.amplitude.com', '*.sentry.io'],
      imgSrc: ["'self'", 'https://cdn.collections.dev'],
      formAction: null,
    },
  })
);

app.set('trust proxy', true);
await initApiServer(app);

app.use('/admin', express.static(pathList.build('admin')));
app.get('/admin/*', (_req, res) => {
  res.sendFile(pathList.build('admin', 'index.html'));
});
