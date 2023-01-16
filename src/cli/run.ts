import { createCli } from './index';

createCli()
  .then((program) => program.parseAsync(process.argv))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
