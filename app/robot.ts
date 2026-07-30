export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Keep your admin panel hidden from Google
    },
    sitemap: 'https://promptworld.store/sitemap.xml', // REPLACE WITH YOUR ACTUAL DOMAIN
  };
}