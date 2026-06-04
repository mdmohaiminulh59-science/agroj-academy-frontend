import React from 'react';
import { Target, Eye, Trophy, BookOpen, Compass, Award } from 'lucide-react';

const About = () => {
  const achievements = [
    { year: '2025', desc: '98% Students achieved GPA 5.00 in PSC and JSC Board Exams.' },
    { year: '2024', desc: 'Opened our modern ICT and Computer Lab to foster digital literacy.' },
    { year: '2023', desc: 'Over 300 students successfully graduated from our program.' },
  ];

  const facilities = [
    'Fully Air-Conditioned Classrooms',
    'State-of-the-Art Science and Physics/Chemistry Lab kits',
    'ICT Computer terminals for Grade 5 & 8 practicals',
    'CCTV-monitored safe campus environment',
    'Rich library collection with textbooks and solution sheets',
    'Weekly parent-teacher feedback portals'
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .about-title {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .intro-lead {
          font-size: 1.1rem;
          color: var(--text-secondary);
          text-align: center;
          max-width: 800px;
          margin: 0 auto 3rem auto;
        }
        .mission-vision-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .about-section-card {
          padding: 2.5rem;
          border-radius: var(--radius-md);
        }
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .achievement-row {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        .achievement-row:last-child {
          border-bottom: none;
        }
        .achievement-year {
          background-color: var(--accent-light);
          color: var(--accent);
          font-weight: 800;
          font-size: 1.1rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
        }
        .facility-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .mission-vision-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <h1 className="about-title">About Our Coaching</h1>
      <p className="intro-lead">
        Academic Excellence Coaching has been a pioneer in Grade 5 and Grade 8 educational guidelines in Dhaka. We are committed to making students understand their subjects fundamentally rather than memorizing.
      </p>

      {/* Mission & Vision */}
      <div className="mission-vision-grid">
        <div className="glass-card about-section-card">
          <div className="icon-circle" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Target size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            To guide students through customized study guides, intensive routines, and interactive classes, unlocking their academic capability and preparing them for secondary education with strong basic concepts.
          </p>
        </div>

        <div className="glass-card about-section-card">
          <div className="icon-circle" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Eye size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Our Vision</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            To become the most reliable hub of child tutoring in Bangladesh, incorporating standard technology (web dashboards, digital reports) to bridge communication between tutors, students, and guardians.
          </p>
        </div>
      </div>

      {/* Achievements & Facilities */}
      <div className="mission-vision-grid" style={{ marginBottom: '2rem' }}>
        {/* Achievements */}
        <div className="glass-card about-section-card">
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} style={{ color: 'var(--accent)' }} />
            <span>Key Achievements</span>
          </h3>
          <div>
            {achievements.map((item, idx) => (
              <div key={idx} className="achievement-row">
                <span className="achievement-year">{item.year}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="glass-card about-section-card">
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} style={{ color: 'var(--primary)' }} />
            <span>Facilities Offered</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {facilities.map((facility, idx) => (
              <div key={idx} className="facility-item">
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: 'var(--radius-full)'
                }} />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
