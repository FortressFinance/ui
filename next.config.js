/* eslint-disable @typescript-eslint/no-var-requires */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"],
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/FortressFinance/assets/master/blockchains/**",
      },
    ],
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
}

module.exports = withSentryConfig(
  nextConfig,
  { silent: true },
  { hideSourcemaps: true }
)
