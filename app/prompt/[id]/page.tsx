import { getAllPrompts } from '@/lib/store';
import type { Metadata } from 'next';
import PromptDetailClient from './PromptDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const prompts = getAllPrompts();
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return { title: 'Prompt Not Found | PromptWorld AI' };
  }

  return {
    title: `${prompt.title} - AI Prompt | PromptWorld AI`,
    description: `${prompt.description}. Generated with ${prompt.ai_tool} (${prompt.model}). Copy this ${prompt.style} prompt for free.`,
    keywords: [prompt.category, prompt.style, prompt.ai_tool, 'AI prompt', 'copy prompt', 'Midjourney prompt'],
    openGraph: {
      title: `${prompt.title} - AI Prompt`,
      description: prompt.description,
      url: `https://promptworld.store/prompt/${prompt.id}`,
      siteName: 'PromptWorld AI',
      images: [
        {
          url: prompt.image_url,
          width: 800,
          height: 600,
          alt: prompt.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PromptDetailClient id={id} />;
}