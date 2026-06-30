import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  allowedDevOrigins:[
    `${process.env.NEXT_PUBLIC_HOST}`,
    `${process.env.NEXT_PUBLIC_FRONT}`
  ]
};

export default nextConfig;
