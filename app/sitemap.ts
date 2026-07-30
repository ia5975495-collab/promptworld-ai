import { getServerPrompts } from '@/lib/server-prompts';

export default async function sitemap() {
  const prompts = await getServerPrompts();
  const baseUrl = 'https://promptworld.store'; // REPLACE WITH YOUR ACTUAL DOMAIN

  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
  ];

  const promptPages = prompts.map((p) => ({
    url: `${baseUrl}/prompt/${p.id}`,
    lastModified: new Date(p.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...promptPages];
}