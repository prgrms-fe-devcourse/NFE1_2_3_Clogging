/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 런타임에 사용할 환경 변수 명시
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // 환경 변수를 사용하는 도메인 허용
  images: {
    domains: [process.env.NEXT_PUBLIC_API_URL],
  },
};
export default nextConfig;
