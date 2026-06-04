import React, { useState, useEffect } from 'react';
import { Calendar, Search, Megaphone, FileDown, Bell } from 'lucide-react';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const defaultNotices = [
    {
      _id: 'n-1',
      title: 'Grade 5 Half-Yearly Model Test Routine',
      description: 'The half-yearly model exam for Grade 5 will start from July 15, 2026. All subjects are compulsory. Attendance is mandatory.',
      category: 'exam',
      date: '2026-06-10T00:00:00.000Z'
    },
    {
      _id: 'n-2',
      title: 'Eid-ul-Adha Vacation Announcement',
      description: 'The coaching center will remain closed from June 12 to June 18 on account of Eid-ul-Adha. Regular classes resume from June 19.',
      category: 'holiday',
      date: '2026-06-02T00:00:00.000Z'
    },
    {
      _id: 'n-3',
      title: 'JSC Science Practical Class Notice',
      description: 'Extra practical classes for Grade 8 Science (Physics and Chemistry experiments) are scheduled for this Friday at 9:30 AM.',
      category: 'academic',
      date: '2026-06-01T00:00:00.000Z'
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE}/notices`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data.length > 0) {
          setNotices(data);
        } else {
          setNotices(defaultNotices);
        }
      })
      .catch(() => {
        setNotices(defaultNotices);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || n.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .notice-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }
        .notice-card {
          padding: 2rem;
          margin-bottom: 1.5rem;
          border-left: 5px solid var(--primary);
        }
        .notice-card.exam { border-left-color: var(--danger); }
        .notice-card.holiday { border-left-color: var(--warning); }
        .notice-card.academic { border-left-color: var(--success); }
        
        .cat-tag {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
        .cat-tag.exam { background-color: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .cat-tag.holiday { background-color: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .cat-tag.academic { background-color: rgba(16, 185, 129, 0.1); color: var(--success); }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Bell style={{ color: 'var(--accent)' }} />
          <span>Notice Board</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Stay updated with official academic schedules, tests routines, and holiday announcements.</p>
      </div>

      {/* Filter and Search controls */}
      <div className="notice-filters">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className={`filter-tab ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>All</button>
          <button className={`filter-tab ${category === 'academic' ? 'active' : ''}`} onClick={() => setCategory('academic')}>Academic</button>
          <button className={`filter-tab ${category === 'exam' ? 'active' : ''}`} onClick={() => setCategory('exam')}>Exams</button>
          <button className={`filter-tab ${category === 'holiday' ? 'active' : ''}`} onClick={() => setCategory('holiday')}>Holidays</button>
        </div>

        <div className="input-wrapper" style={{ minWidth: '250px' }}>
          <Search size={16} className="input-icon" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Notices List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Notice Board...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div key={notice._id} className={`glass-card notice-card ${notice.category} animate-fade-in`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span className={`cat-tag ${notice.category}`}>{notice.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {new Date(notice.date).toLocaleDateString('en-GB')}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{notice.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  {notice.description}
                </p>

                {notice.category === 'exam' && (
                  <button 
                    onClick={() => alert('Downloading exam schedule PDF...')}
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', alignSelf: 'flex-start' }}
                  >
                    <FileDown size={14} />
                    <span>Download Routine PDF</span>
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No notices match your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notices;
