/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA)
  distDir: './dist', // Changes the build output directory to `./dist/`
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 2592000, // 30 days
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals = {
      ...config.externals,
      sharp: "commonjs sharp",
    };
    return config;
  },
};

export default nextConfig;