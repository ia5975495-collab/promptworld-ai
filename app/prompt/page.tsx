import { MOCK_PROMPTS } from '@/lib/mockData';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prompt = MOCK_PROMPTS.find(p => p.id === id);
  
  if (!prompt) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      <Link href="/gallery" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Gallery
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div>
          <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #252536' }}>
            <img 
              src={prompt.image_url} 
              alt={prompt.title}
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              {prompt.ai_tool}
            </span>
            <span style={{
              backgroundColor: '#1c1c2a',
              color: '#9ca3af',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              border: '1px solid #252536'
            }}>
              {prompt.model}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            {prompt.title}
          </h1>
          <p style={{ color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem' }}>
            {prompt.description}
          </p>

          <div style={{ backgroundColor: '#15151f', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #252536', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>Prompt</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(prompt.prompt_text)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8b5cf6',
                  border: 'none',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                📋 Copy
              </button>
            </div>
            <p style={{
              color: '#d1d5db',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              backgroundColor: '#0a0a0f',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #252536',
              lineHeight: '1.6'
            }}>
              {prompt.prompt_text}
            </p>
          </div>

          {prompt.negative_prompt && (
            <div style={{ backgroundColor: '#15151f', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #252536', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '0.75rem' }}>Negative Prompt</h3>
              <p style={{
                color: '#9ca3af',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                backgroundColor: '#0a0a0f',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #252536'
              }}>
                {prompt.negative_prompt}
              </p>
            </div>
          )}

          <div style={{ backgroundColor: '#15151f', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #252536', marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1rem', marginBottom: '1rem' }}>Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div><span style={{ color: '#6b7280' }}>Style:</span> <span style={{ color: 'white', marginLeft: '0.5rem' }}>{prompt.style}</span></div>
              <div><span style={{ color: '#6b7280' }}>Aspect Ratio:</span> <span style={{ color: 'white', marginLeft: '0.5rem' }}>{prompt.aspect_ratio}</span></div>
              <div><span style={{ color: '#6b7280' }}>Category:</span> <span style={{ color: 'white', marginLeft: '0.5rem' }}>{prompt.category}</span></div>
              <div><span style={{ color: '#6b7280' }}>Model:</span> <span style={{ color: 'white', marginLeft: '0.5rem' }}>{prompt.model}</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {prompt.tags.map((tag: string) => (
              <Link key={tag} href={`/gallery?tag=${tag}`} style={{
                backgroundColor: '#1c1c2a',
                color: '#9ca3af',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                textDecoration: 'none',
                border: '1px solid #252536'
              }}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}