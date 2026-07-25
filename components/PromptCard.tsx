import Link from 'next/link';

export default function PromptCard({ prompt }: { prompt: any }) {
  return (
    <Link href={`/prompt/${prompt.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: '#15151f',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid #252536',
        transition: 'transform 0.3s'
      }}>
        <div style={{ position: 'relative', aspectRatio: '3/4' }}>
          <img 
            src={prompt.image_url} 
            alt={prompt.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {prompt.is_premium && (
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: '#0a0a0f',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              PRO
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(10, 10, 15, 0.7)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}>
            {prompt.ai_tool}
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            {prompt.title}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
            <span>❤️ {prompt.likes_count}</span>
            <span>⬇️ {prompt.downloads_count}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {prompt.tags.map((tag: string) => (
              <span key={tag} style={{
                backgroundColor: '#1c1c2a',
                color: '#9ca3af',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem'
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}