import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // เพิ่มการตั้งค่า devServer
  devServer: {
    host: '0.0.0.0', // ทำให้เครื่องอื่นสามารถเข้าถึงได้
  },
};

export default nextConfig;
