import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Seeded recipes serve their thumbnails from here.
      { protocol: 'https', hostname: 'ftp.goit.study' },
    ],
  },
};

export default nextConfig;
