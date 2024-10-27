const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.collections.dev",
      },
      {
        protocol: "https",
        hostname: "*.collectionsdemo.live",
      },
    ],
  },
};

export default nextConfig;
