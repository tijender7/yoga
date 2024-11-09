/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['dmewjfaaihwxscvhzmxv.supabase.co'],
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