/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["https://image.tmdb.org/"],
    // formats: ["image/avif", "image/webp"],
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        // pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
