import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: '#0a0a0f',
      borderBottom: '1px solid #1c1c2a',
      padding: '1rem 2rem'
    }}>
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: 'bold'
        }}>
          <span style={{
            background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }}>
            ✨
          </span>
          <span>PromptWorld AI</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href="/" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>Home</Link>
          <Link href="/gallery" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>Gallery</Link>
          <Link href="/categories" style={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.875rem' }}>Categories</Link>
        </div>

        <Link href="/subscribe" style={{
          background: 'linear-gradient(to right, #8b5cf6, #6366f1)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          Go Premium
        </Link>
      </nav>
    </header>
  );
}