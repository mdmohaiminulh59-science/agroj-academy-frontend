import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Clock, Users, ArrowRight, Star, MessageSquare, Calendar, Phone } from 'lucide-react';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    // Fetch latest notices for preview
    fetch(`${API_BASE}/notices`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNotices(data.slice(0, 3)))
      .catch((err) => console.log('Error fetching home notices:', err));
  }, []);

  const stats = [
    { value: '98.5%', label: 'PSC / JSC Success Rate' },
    { value: '850+', label: 'GPA-5 Achievers' },
    { value: '25+', label: 'Expert Educators' },
    { value: '1:10', label: 'Teacher-Student Ratio' }
  ];

  const highlights = [
    {
      icon: <Award size={24} style={{ color: 'var(--accent)' }} />,
      title: 'Board Exam Preparation',
      description: 'Specially designed model tests and lecture sheets focused on PEC (Grade 5) and JSC (Grade 8) curriculum.'
    },
    {
      icon: <BookOpen size={24} style={{ color: 'var(--accent)' }} />,
      title: 'Interactive Study Materials',
      description: 'Students get access to rich PDF books, assignment sheets, and chapter summaries directly on their dashboard.'
    },
    {
      icon: <Clock size={24} style={{ color: 'var(--accent)' }} />,
      title: 'Routine-Based Progress',
      description: 'Structured class schedules, weekly tests, and detailed result publishing to track day-to-day progress.'
    },
    {
      icon: <Users size={24} style={{ color: 'var(--accent)' }} />,
      title: 'Experienced Instructors',
      description: 'Mentors from top universities (DU, BUET) specialized in guiding children with patience and care.'
    }
  ];

  const testimonials = [
    {
      name: 'Rahat Rahman',
      role: 'Parent of Grade 8 Student',
      text: 'Academic Excellence Coaching changed my son\'s approach to Mathematics. The routine exams helped him build confidence before the board exams!'
    },
    {
      name: 'Sumaiya Akter',
      role: 'Grade 5 Student (GPA 5.00)',
      text: 'I loved the science and ICT classes here. The teachers explain everything with simple examples and stories. The PDF notes were very helpful!'
    }
  ];

  return (
    <div className="animate-fade-in">
      <style>{`
        .hero-section {
          padding: 6rem 0;
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(249, 115, 22, 0.03) 100%);
          text-align: center;
          position: relative;
        }
        .hero-headline {
          font-size: 3.2rem;
          font-weight: 800;
          max-width: 800px;
          margin: 0 auto 1.5rem auto;
          line-height: 1.15;
        }
        .hero-sub {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
        }
        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .section-header h2 {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .section-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .grid-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }
        .stat-card {
          text-align: center;
          padding: 2rem;
        }
        .stat-card h3 {
          font-size: 2.5rem;
          color: var(--accent);
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        .stat-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 5rem;
        }
        .testimonial-card {
          padding: 2.5rem;
          position: relative;
        }
        .testi-text {
          font-style: italic;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          position: relative;
        }
        .testi-author {
          font-weight: 700;
          font-family: var(--font-title);
        }
        .testi-role {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .home-notice-box {
          border-left: 4px solid var(--accent);
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.2rem;
          }
          .hero-section {
            padding: 4rem 0;
          }
        }
      `}</style>

      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-headline">
            Build a Solid Foundation for <span className="gradient-text">Grade 5 & 8</span> Success
          </h1>
          <p className="hero-sub">
            Prepare for secondary education with specialized coaching in Dhaka. Tailored syllabus guides, model tests, and dashboard resources for Bengali & English medium students.
          </p>
          <div className="hero-cta">
            <Link to="/admissions" className="btn btn-accent btn-lg">
              <span>Enroll Now</span>
              <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
              <Phone size={18} />
              <span>Book Free Demo Class</span>
            </a>
          </div>
        </div>
      </section>

      {/* Success Metrics Banner */}
      <section style={{ padding: '3rem 0', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Our Coaching?</h2>
            <p>We provide structural learning guidelines designed for the Bangladesh National Curriculum.</p>
          </div>

          <div className="grid-highlights">
            {highlights.map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{
                  backgroundColor: 'var(--accent-light)',
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Notices Preview */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)' }}>Latest Announcements</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Keep track of holidays, exams, and routines</p>
            </div>
            <Link to="/notices" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              View All Notices
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notices.length > 0 ? (
              notices.map((notice) => (
                <div key={notice._id} className="glass-card home-notice-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{notice.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} />
                      {new Date(notice.date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{notice.description}</p>
                </div>
              ))
            ) : (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active announcements at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Here is what students and parents say about their experience with us.</p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="glass-card testimonial-card">
                <MessageSquare size={24} style={{ color: 'var(--primary-hover)', opacity: 0.15, position: 'absolute', top: '20px', right: '20px' }} />
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="testi-text">"{testi.text}"</p>
                <div>
                  <h4 className="testi-author">{testi.name}</h4>
                  <p className="testi-role">{testi.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
