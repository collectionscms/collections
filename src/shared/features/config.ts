const defaultSuperfastConfig: any = {
  ui: {
    sidebarWidth: 260,
  },
  webpack: {
    admin: (config) => config,
  },
};

const loadConfig = () => {
  return defaultSuperfastConfig;
};

const config = loadConfig();

export default config;
