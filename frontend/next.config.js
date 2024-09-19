/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['dmewjfaaihwxscvhzmxv.supabase.co'],
    },
    async redirects() {
      return [
        {
          source: '/test-redirect',
          destination: '/auth',
          permanent: false,
        },
      ]
    },
  }
  
  module.exports = nextConfig