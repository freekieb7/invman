/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow hot reloading
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

module.exports = nextConfig
