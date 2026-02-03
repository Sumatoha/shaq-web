/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use SSR mode for Amplify (no static export)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shaq.kz',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // API will be proxied through Amplify rewrites
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiUrl) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
