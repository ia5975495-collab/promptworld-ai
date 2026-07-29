export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1c1c2a', padding: '3rem 1rem', marginTop: '5rem' }}>
      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        © {new Date().getFullYear()} PromptWorld AI. All rights reserved.
      </div>
    </footer>
  );
}   