/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.clerk.com'],
  },
  async rewrites() {
    // Proxy Clerk requests through the app so *.vercel.app works without a custom domain
    const clerkApi = process.env.CLERK_FRONTEND_API
    if (!clerkApi) return []
    return [
      {
        source: '/api/clerk/:path*',
        destination: `${clerkApi}/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
