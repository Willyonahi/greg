/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.discordapp.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/discord/:path*',
        destination: 'https://discord.com/api/v10/:path*',
      },
    ];
  },
  // Add any other production settings here
}

module.exports = nextConfig 