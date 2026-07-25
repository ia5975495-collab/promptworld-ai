import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';

export default function CategoriesPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Browse by Category</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {CATEGORIES.map((category) => (
          <Link 
            key={category.name} 
            href={`/gallery?category=${category.name.toLowerCase()}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              backgroundColor: '#15151f',
              borderRadius: '1rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid #252536',
              transition: 'transform 0.3s'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
              <h3 style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{category.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{category.count} prompts</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}