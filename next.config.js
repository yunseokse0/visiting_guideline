/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel 배포를 위한 최적화 설정
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 성능 최적화
  compress: true,
  // 빌드 최적화
  swcMinify: true,
  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  }
}

module.exports = nextConfig
