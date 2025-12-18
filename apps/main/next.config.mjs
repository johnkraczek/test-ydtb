import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './dist', // Changes the build output directory to `./dist/`
  turbopack: {
    root: path.resolve('../../'), // Specify the absolute root directory
  },
    images: {
    unoptimized: true,
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 2592000, // 30 days
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Vercel applies default security headers automatically
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        sharp: "commonjs sharp",
      });
    } else {
      config.externals = {
        ...config.externals,
        sharp: "commonjs sharp",
      };
    }

    // Handle node: protocol for better-auth
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        querystring: false,
        util: false,
        buffer: false,
      };
    }

    // Handle node: modules with comprehensive aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:crypto": "crypto-browserify",
      "node:fs": false,
      "node:path": "path-browserify",
      "node:stream": "stream-browserify",
      "node:url": "url/",
      "node:util": "util/",
      "node:buffer": "buffer/",
      "node:process": "process/browser",
      "node:querystring": "querystring-es3",
    };

    return config;
  },
};

export default nextConfig;