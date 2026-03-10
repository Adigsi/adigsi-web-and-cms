/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['cloudinary', '@aws-sdk/client-s3', '@aws-sdk/lib-storage', '@google-cloud/storage', 'sharp'],
}

export default nextConfig