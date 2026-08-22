import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "delegator-jackknife-hamburger.ngrok-free.dev",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xbccxaptwbzorktdpkjc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
