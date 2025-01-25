import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

const preview = {
  parameters: {},
  loaders: [mswLoader],
};

export default preview;
