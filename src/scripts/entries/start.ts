import express from 'express';
import helmet from 'helmet';
import { initApiServer } from '../../express/api.js';
import { pathList } from '../../utilities/pathList.js';

const app = express();

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https://cdn.collections.dev'],
    },
  })
);

app.set('trust proxy', true);
await initApiServer(app);

app.use('/admin', express.static(pathList.build('admin')));
app.get('/admin/*', (_req, res) => {
  res.sendFile(pathList.build('admin', 'index.html'));
});
