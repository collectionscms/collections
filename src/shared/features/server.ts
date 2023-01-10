import chalk from 'chalk';
import express from 'express';
import Hooks from './hooks';
import { users } from 'superfast-core';

const launch = async () => {
  try {
    const app = express();
    await Hooks.doAction('server/init', app);

    app.get('/users', users);

    app.use(async (_req, res) => {
      const response = await Hooks.applyFilters(
        'server/notFound',
        res.status(404).json({ message: 'not_found' })
      );
      response.send();
    });

    const port = process.env.SERVER_PORT || 4000;
    const host = process.env.SERVER_HOST || 'http://localhost';

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
