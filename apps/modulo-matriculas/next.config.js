/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@edunexia/ui-components"],
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
}

module.exports = nextConfig 