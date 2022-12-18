/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  experimental: {
    appDir: true
  },
  images: {
    domains: ['cdn.discordapp.com'],
  },
}

module.exports = nextConfig
