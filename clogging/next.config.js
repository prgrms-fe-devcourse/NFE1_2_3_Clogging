// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
  },
  // 정적 파일 제공 설정
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination:
          'https://firebasestorage.googleapis.com/v0/b/clogging-d3b17.appspot.com/o/:path*',
      },
    ];
  },
};

export default nextConfig;
