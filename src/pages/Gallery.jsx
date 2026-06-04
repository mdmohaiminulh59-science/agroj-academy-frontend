import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const defaultItems = [
    {
      _id: 'g-1',
      title: 'Model Test Exam Hall',
      category: 'classroom',
      bgGrad: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
    },
    {
      _id: 'g-2',
      title: 'Science Fair Project Presentations',
      category: 'events',
      bgGrad: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
    },
    {
      _id: 'g-3',
      title: 'Merit Award Winners 2025',
      category: 'achievements',
      bgGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      _id: 'g-4',
      title: 'ICT Hands-on Lab Session',
      category: 'classroom',
      bgGrad: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    },
    {
      _id: 'g-5',
      title: 'Language Club Debate Contest',
      category: 'events',
      bgGrad: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE}/gallery`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data.length > 0) {
          setItems(data);
        } else {
          setItems(defaultItems);
        }
      })
      .catch(() => {
        setItems(defaultItems);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = category === 'all' 
    ? items 
    : items.filter(item => item.category === category);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .gallery-card {
          overflow: hidden;
          position: relative;
          height: 240px;
          border-radius: var(--radius-md);
        }
        .gallery-img-mock {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: var(--font-title);
          padding: 1rem;
          text-align: center;
          font-size: 1.1rem;
          font-weight: 700;
          transition: var(--transition);
        }
        .gallery-card:hover .gallery-img-mock {
          transform: scale(1.05);
        }
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 1.5rem 1rem 1rem 1rem;
          color: white;
        }
        .gallery-overlay span {
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.1em;
          background-color: var(--accent);
          padding: 0.15rem 0.4rem;
          border-radius: 2px;
          margin-bottom: 0.25rem;
          display: inline-block;
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Camera style={{ color: 'var(--accent)' }} />
          <span>Coaching Gallery</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Moments from classes, model test assessments, and language contests.</p>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button className={`filter-tab ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All Photo Assets</button>
        <button className={`filter-tab ${category === 'classroom' ? 'active' : ''}`} onClick={() => setCategory('classroom')}>Classroom Activities</button>
        <button className={`filter-tab ${category === 'events' ? 'active' : ''}`} onClick={() => setCategory('events')}>Coaching Events</button>
        <button className={`filter-tab ${category === 'achievements' ? 'active' : ''}`} onClick={() => setCategory('achievements')}>Student Achievements</button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading gallery assets...</div>
      ) : (
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="glass-card gallery-card animate-fade-in">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div className="gallery-img-mock" style={{ background: item.bgGrad || 'linear-gradient(135deg, #1e3a8a 0%, #e2e8f0 100%)' }}>
                  <ImageIcon size={32} style={{ opacity: 0.25, position: 'absolute', top: '15px', right: '15px' }} />
                  <span style={{ zIndex: 2 }}>{item.title}</span>
                </div>
              )}
              <div className="gallery-overlay">
                <span>{item.category}</span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
