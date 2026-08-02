import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for next-mdx-remote under Turbopack until upstream is fixed.
  transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
