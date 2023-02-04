/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  reactStrictMode: true,
  swcMinify: true,
  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    })

    return config
  },
  async rewrites() {
    return [
      { source: "/api/anvil-mainnet", destination: "http://18.196.63.80:8546" },
      {
        source: "/api/anvil-arbitrum",
        destination: "http://18.196.63.80:8545",
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/app",
        has: [
          {
            type: "header",
            key: "host",
            value: "fortress.finance",
          },
        ],
        destination: "https://app.fortress.finance",
        permanent: true,
      },
      {
        source: "/app/:slug*",
        has: [
          {
            type: "header",
            key: "host",
            value: "fortress.finance",
          },
        ],
        destination: "https://app.fortress.finance/:slug*",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
