module.exports = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  compress: false,
  output: 'standalone',
  images: {
    domains: process.env.IMAGES_DOMAINS !== '*' ? process.env.IMAGES_DOMAINS?.split(',') : undefined,
    remotePatterns:
      process.env.IMAGES_DOMAINS === '*'
        ? [
            {
              hostname: '*',
            },
          ]
        : undefined,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
