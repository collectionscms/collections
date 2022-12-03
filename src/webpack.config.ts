import webpack from 'webpack';
import adminDefaultWebpack from './configs/webpack/admin';
import serverDefaultWebpack from './configs/webpack/server';

const webpackConfigureGenerator =
  (config: webpack.Configuration) =>
  (
    ...overrides: ((config: webpack.Configuration) => webpack.Configuration)[]
  ): webpack.Configuration =>
    overrides.reduce<webpack.Configuration>((memo, current) => current?.(memo) ?? memo, config);

const webpackAdminConfigure = webpackConfigureGenerator(adminDefaultWebpack as any);
const webpackServerConfigure = webpackConfigureGenerator(serverDefaultWebpack as any);

export { webpackAdminConfigure, webpackServerConfigure };
