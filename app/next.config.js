/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compress: true,
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        aggregateTimeout: 200,
        poll: 1000,
      };
    }

    return config;
  },
  experimental: {
    appDir: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
