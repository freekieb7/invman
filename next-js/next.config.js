/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  env: {
    NEXT_PUBLIC_INVMAN_API_URL: process.env.NEXT_PUBLIC_INVMAN_API_URL,
  },
};

module.exports = nextConfig;
