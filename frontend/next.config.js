/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Build estático para hospedagem no S3 + CloudFront (ver docs/ARCHITECTURE.md)
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
