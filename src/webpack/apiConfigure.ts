import webpack from 'webpack';
import { pathList } from '../utilities/pathList.js';

export const apiConfigure: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  devtool: 'inline-source-map',
  experiments: {
    outputModule: true,
  },
  externals: {
    argon2: 'argon2',
    knex: 'knex',
    pino: 'pino',
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
