/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained build (server.js + minimal node_modules) shipped to the VM by .github/workflows/deploy.yml
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['cloudinary', '@aws-sdk/client-s3', '@aws-sdk/lib-storage', '@google-cloud/storage', 'sharp'],
}

export default nextConfig