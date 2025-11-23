import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled cacheComponents to support dynamic Server Components with cookies/headers
  // cacheComponents: true,
};

export default nextConfig;
