/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['dmewjfaaihwxscvhzmxv.supabase.co'],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    async redirects() {
      return [
        {
          source: '/terms-of-service',
          destination: '/terms',
          permanent: true,
        },
        {
          source: '/test-redirect',
          destination: '/auth',
          permanent: false,
        },
      ]
    },
  }
  
  module.exports = nextConfig