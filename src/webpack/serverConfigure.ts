import webpack from 'webpack';
import { pathList } from '../utilities/pathList.js';

export const serverConfigure: webpack.Configuration = {
  mode: 'development',
  target: 'node',
  experiments: {
    outputModule: true,
  },
  externals: {
    argon2: 'argon2',
    knex: 'knex',
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
