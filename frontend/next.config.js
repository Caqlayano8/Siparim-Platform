/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => 'siparim-build-1',
  output: undefined,
  images: {
    domains: ['placehold.co', 'localhost', 'via.placeholder.com'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
