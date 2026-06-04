import React, { useState, useEffect } from 'react';
import { BookOpen, Search, User, Calendar, Tag } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const defaultBlogs = [
    {
      _id: 'b-1',
      title: 'Top 5 Strategies to Ace the Mathematics Model Tests',
      content: 'Mathematics requires rigorous problem-solving. Make sure to solve previous board questions for Grade 5 division and Grade 8 algebraic formulas. Focus on completing easy topics first to save time...',
      author: 'Mizanur Rahman',
      tags: ['Study Tips', 'Math'],
      publishedAt: '2026-06-03T00:00:00.000Z'
    },
    {
      _id: 'b-2',
      title: 'Understanding General Science Bonds for Grade 8 Students',
      content: 'Chemical bonding can seem complex initially. Focus on electron distributions, differences between ionic and covalent bonds, and draw molecule structures. Memorize the first 20 elements of the periodic table...',
      author: 'Dr. Tanvir Anis',
      tags: ['Science', 'Study Tips'],
      publishedAt: '2026-05-28T00:00:00.000Z'
    },
    {
      _id: 'b-3',
      title: 'English Writing Format Guidelines for Grade 5 & Grade 8',
      content: 'Formal letter writing and dialog writing carry high marks in primary board exams. Remember to keep formats clean: address, subject, salutation, body blocks, and signature in correct alignments...',
      author: 'Sarah Tabassum',
      tags: ['English', 'Exam Prep'],
      publishedAt: '2026-05-20T00:00:00.000Z'
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE}/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs(defaultBlogs);
        }
      })
      .catch(() => {
        setBlogs(defaultBlogs);
      })
      .finally(() => setLoading(false));
  }, []);

  const allTags = ['all', ...new Set(blogs.flatMap(blog => blog.tags || []))];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'all' || (b.tags && b.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .blog-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .blog-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .blog-tag-pill {
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 700;
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent)' }} />
          <span>Educational Blog</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Get study tips, board exam preparation guides, and academic insights from our instructors.</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {allTags.map((tag) => (
            <button 
              key={tag} 
              className={`filter-tab ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="input-wrapper" style={{ minWidth: '250px' }}>
          <Search size={16} className="input-icon" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading articles...</div>
      ) : (
        <div className="blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="glass-card blog-card animate-fade-in">
                <div className="blog-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={12} />
                    {blog.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(blog.publishedAt).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{blog.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  {blog.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {blog.tags && blog.tags.map((tag, idx) => (
                      <span key={idx} className="blog-tag-pill">{tag}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => alert('Opening full article page...')}
                    style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}
                  >
                    Read More &rarr;
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '3rem', gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
              No articles found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
