import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pin the root so Next does not walk up to the home directory looking for a lockfile
  turbopack: { root: __dirname },
};

export default nextConfig;
