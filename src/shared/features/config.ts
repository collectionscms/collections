const defaultConfig: any = {
  ui: {
    navWidth: 260,
  },
  webpack: {
    admin: (config) => config,
  },
};

const loadConfig = () => {
  return defaultConfig;
};

const config = loadConfig();

export default config;
