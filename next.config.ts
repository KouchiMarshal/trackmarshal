import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "commissairedepiste.com" }],
        destination: "https://www.trackmarshal.app/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.commissairedepiste.com" }],
        destination: "https://www.trackmarshal.app/:path*",
        permanent: true,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [

      {
        protocol: "https",
        hostname: "uzojugyjlakssipvvvsq.supabase.co",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

    ],
  },

};

export default nextConfig;