const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.collections.dev',
      },
      {
        protocol: 'https',
        hostname: '*.collectionscms.com',
      },
    ],
  },
};

export default nextConfig;
