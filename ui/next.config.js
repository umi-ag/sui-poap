/** @type {import('next').NextConfig} */
const nextConfig = {
  runtime: "edge",
  images: {
    domains: [
      // 'storage.googleapis.com',
      "user-images.githubusercontent.com",
      "assets.coingecko.com",
    ],
  },
  experimental: {
    appDir: true,
    runtime: "experimental-edge",
  },
};

module.exports = nextConfig;
