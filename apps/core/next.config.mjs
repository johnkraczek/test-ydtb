/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA)
  distDir: './dist', // Changes the build output directory to `./dist/`
  // Configure images to handle external domains
  images: {
    unoptimized: true,
  },
}

export default nextConfig