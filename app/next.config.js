/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Keep session provider outside strict mode to prevent duplicate refresh token requests
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
  images: {
    domains: ["ui-avatars.com"],
  },
};

module.exports = nextConfig;
