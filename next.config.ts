import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  ...(process.env.NEXT_PUBLIC_ANDROID_BUILD === "1" ? { distDir: "mobile-out" } : process.env.MEMBERSHIP_TEST_BUILD === "1" ? { distDir: "membership-test-out" } : {}),
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { globalNotFound: true },
};
export default config;
