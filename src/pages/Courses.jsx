import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Calendar, DollarSign, User, ClipboardList, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [loading, setLoading] = useState(true);
  const [enrollMsg, setEnrollMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const defaultCourses = [
    {
      _id: 'default-5-math',
      title: 'Mathematics (Grade 5)',
      class: '5',
      description: 'Focuses on arithmetic operations, fractions, decimals, basic geometry, and mathematical reasoning.',
      syllabus: ['Chapter 1: Multiplications', 'Chapter 2: Division', 'Chapter 3: Mathematical Symbols', 'Chapter 4: Decimals'],
      fee: 2000,
      schedule: 'Sat, Wed - 4:00 PM - 5:30 PM',
      teacherId: { name: 'Mizanur Rahman', subject: 'Mathematics', qualification: 'BSc in CSE, BUET' }
    },
    {
      _id: 'default-5-english',
      title: 'English (Grade 5)',
      class: '5',
      description: 'Covers English grammar, vocabulary building, comprehension reading, and writing exercises.',
      syllabus: ['Unit 1: Hello!', 'Unit 2: See You!', 'Grammar: Parts of Speech', 'Writing: Letter Writing'],
      fee: 1800,
      schedule: 'Sun, Tue - 4:00 PM - 5:30 PM',
      teacherId: { name: 'Sarah Tabassum', subject: 'English', qualification: 'MA in English Literature, DU' }
    },
    {
      _id: 'default-8-math',
      title: 'Mathematics (Grade 8)',
      class: '8',
      description: 'Advanced mathematics prep including algebra, sets, profit-loss ratios, indices, and solid geometry.',
      syllabus: ['Chapter 1: Patterns', 'Chapter 2: Profit & Loss', 'Chapter 3: Algebraic Formulas', 'Chapter 4: Sets'],
      fee: 2500,
      schedule: 'Mon, Thu - 5:30 PM - 7:00 PM',
      teacherId: { name: 'Mizanur Rahman', subject: 'Mathematics', qualification: 'BSc in CSE, BUET' }
    },
    {
      _id: 'default-8-science',
      title: 'General Science (Grade 8)',
      class: '8',
      description: 'Detailed analysis of basic physics, chemistry bonds, biological systems, and environmental changes.',
      syllabus: ['Chapter 1: Classification of Animal Kingdom', 'Chapter 2: Cell Division', 'Chapter 3: Coordination and Secretion'],
      fee: 2200,
      schedule: 'Sat, Wed - 5:30 PM - 7:00 PM',
      teacherId: { name: 'Dr. Tanvir Anis', subject: 'Science', qualification: 'PhD in Bio-Science, DU' }
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (data.length > 0) {
          setCourses(data);
        } else {
          // If no courses created in MongoDB yet, load local defaults
          setCourses(defaultCourses);
        }
      })
      .catch(() => {
        // Fallback on network errors
        setCourses(defaultCourses);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollMsg({ type: '', text: '' });

    if (!user) {
      return navigate('/login');
    }

    if (user.role !== 'student') {
      return setEnrollMsg({ type: 'error', text: 'Only registered students can enroll in courses.' });
    }

    try {
      const res = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollMsg({ type: 'success', text: 'Successfully enrolled! A pending payment has been logged in your dashboard.' });
      } else {
        setEnrollMsg({ type: 'error', text: data.message || 'Enrollment failed.' });
      }
    } catch (err) {
      setEnrollMsg({ type: 'error', text: 'Server error occurred during enrollment.' });
    }
  };

  const filteredCourses = selectedClass === 'all' 
    ? courses 
    : courses.filter(c => c.class === selectedClass);

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .filter-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .filter-tab {
          padding: 0.6rem 1.5rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        .filter-tab.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }
        .course-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .course-badge {
          align-self: flex-start;
          margin-bottom: 1rem;
        }
        .course-info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }
        .syllabus-topics {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-color);
        }
        .topic-pill {
          display: inline-block;
          background-color: var(--bg-tertiary);
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          border-radius: var(--radius-sm);
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Our Courses</h1>
        <p style={{ color: 'var(--text-muted)' }}>Explore subject packages for Grade 5 (Primary School Completion) and Grade 8 (Junior School Certificate) classes.</p>
      </div>

      {enrollMsg.text && (
        <div style={{
          backgroundColor: enrollMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: enrollMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <ShieldAlert size={18} />
          <span>{enrollMsg.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-container">
        <button className={`filter-tab ${selectedClass === 'all' ? 'active' : ''}`} onClick={() => setSelectedClass('all')}>All Grades</button>
        <button className={`filter-tab ${selectedClass === '5' ? 'active' : ''}`} onClick={() => setSelectedClass('5')}>Grade 5</button>
        <button className={`filter-tab ${selectedClass === '8' ? 'active' : ''}`} onClick={() => setSelectedClass('8')}>Grade 8</button>
      </div>

      {/* Course Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading course catalogue...</div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="glass-card course-card animate-fade-in">
              <span className={`badge course-badge ${course.class === '5' ? 'badge-grade5' : 'badge-grade8'}`}>
                Grade {course.class}
              </span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{course.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexGrow: 1, marginBottom: '1.5rem' }}>
                {course.description}
              </p>

              {/* Schedule, Teacher, Fees */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div className="course-info-row">
                  <Calendar size={14} style={{ color: 'var(--primary)' }} />
                  <span><strong>Schedule:</strong> {course.schedule}</span>
                </div>
                <div className="course-info-row">
                  <User size={14} style={{ color: 'var(--primary)' }} />
                  <span><strong>Instructor:</strong> {course.teacherId?.name} ({course.teacherId?.qualification})</span>
                </div>
                <div className="course-info-row">
                  <DollarSign size={14} style={{ color: 'var(--accent)' }} />
                  <span><strong>Monthly Fee:</strong> {course.fee} BDT</span>
                </div>
              </div>

              {/* Syllabus Preview */}
              {course.syllabus && course.syllabus.length > 0 && (
                <div className="syllabus-topics">
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ClipboardList size={12} />
                    <span>Syllabus Highlights:</span>
                  </h4>
                  <div>
                    {course.syllabus.map((topic, i) => (
                      <span key={i} className="topic-pill">{topic}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button 
                onClick={() => handleEnroll(course._id)}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Enroll in Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
