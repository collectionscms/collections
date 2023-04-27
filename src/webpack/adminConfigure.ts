import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { pathList } from '../utilities/pathList.js';

export const adminConfigure: webpack.Configuration = {
  mode: 'development',
  entry: pathList.admin('index.tsx'),
  output: {
    path: pathList.build('admin'),
    publicPath: '/admin/',
    clean: true,
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
      '.js': ['.ts', '.tsx', '.js'],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: pathList.admin('index.html'),
    }),
  ].filter(Boolean),
};
