const defaultSuperfastConfig: any = {
  webpack: {
    admin: (config) => config,
  },
};

const loadConfig = () => {
  return defaultSuperfastConfig;
};

const config = loadConfig();

export default config;
