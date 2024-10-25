import { sentryWebpackPlugin } from '@sentry/webpack-plugin';
import webpack from 'webpack';
import { pathList } from '../utilities/pathList.js';

const { SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env;
const plugins = [
  SENTRY_ORG &&
    SENTRY_PROJECT &&
    SENTRY_AUTH_TOKEN &&
    sentryWebpackPlugin({
      org: SENTRY_ORG,
      project: SENTRY_PROJECT,
      authToken: SENTRY_AUTH_TOKEN,
    }),
];

export const apiConfigure: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  devtool: 'source-map',
  plugins,
  experiments: {
    outputModule: true,
  },
  externals: {
    argon2: 'argon2',
    pino: 'pino',
    '@prisma/client': '@prisma/client',
  },
  output: {
    path: pathList.build(),
    clean: true,
    filename: '[name].js',
    library: {
      type: 'module',
    },
    chunkFormat: 'module',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },
};
