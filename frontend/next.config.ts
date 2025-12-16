import { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true
});

const nextConfig: NextConfig = {
  turbopack: {},
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'f1.tokenpost.kr'
      },
      {
        protocol: 'https',
        hostname: 'img.hankyung.com',
      },
    ]
  },
};

export default withBundleAnalyzer(nextConfig);
