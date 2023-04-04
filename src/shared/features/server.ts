import chalk from 'chalk';
import express from 'express';
import env from '../../env';
import { launchApi } from './api';
import Hooks from './hooks';

const launch = async () => {
  try {
    const app = express();
    const apiApp = await launchApi();
    app.use('/api', apiApp);
    await Hooks.doAction('server/init', app);

    app.use(async (_req, res) => {
      const response = await Hooks.applyFilters(
        'server/notFound',
        res.status(404).json({ message: 'not_found' })
      );
      response.send();
    });

    const port = env.SERVER_PORT || 4000;
    const host = env.SERVER_HOST || 'http://localhost';

    app
      .listen(port, () => {
        console.log(chalk.green(`Express started on ${port} port.`));
        console.log(chalk.green(`To open admin visit ${host}:${port}/admin`));
      })
      .on('error', (e) => {
        console.log(e);
        console.log(chalk.red('Error starting Express'));
      });
  } catch (e) {
    console.log(e);
    console.log(chalk.red('Error starting Express'));
  }
};

export { launch };
