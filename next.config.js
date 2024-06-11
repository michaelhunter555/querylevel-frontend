/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@mui/x-charts"],
  experimental: {
    bundlePagesExternals: true,
  },
};

module.exports = nextConfig;
