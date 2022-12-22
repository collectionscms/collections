const defaultConfig: any = {
  ui: {
    navWidth: 280,
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
