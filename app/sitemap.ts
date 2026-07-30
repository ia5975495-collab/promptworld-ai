import { getAllPrompts } from '@/lib/store';

export default async function sitemap() {
  const prompts = getAllPrompts();
  const baseUrl = 'https://promptworld.store'; // REPLACE WITH YOUR ACTUAL DOMAIN

  // 1. Static pages
  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  // 2. Dynamic prompt pages
  const promptPages = prompts.map((p) => ({
    url: `${baseUrl}/prompt/${p.id}`,
    lastModified: new Date(p.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...promptPages];
}