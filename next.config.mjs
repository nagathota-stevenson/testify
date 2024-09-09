/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  server: {
    host: true,
  }
};

export default nextConfig;
