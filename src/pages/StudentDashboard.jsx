import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, BookOpen, FileDown, CheckCircle2, AlertCircle, RefreshCw, Landmark, ClipboardList, GraduationCap } from 'lucide-react';

const StudentDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel fetches for responsiveness
      const [coursesRes, attendanceRes, resultsRes, assignmentsRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE}/student/my-courses`, { headers }),
        fetch(`${API_BASE}/student/my-attendance`, { headers }),
        fetch(`${API_BASE}/results/my-results`, { headers }),
        fetch(`${API_BASE}/assignments/my-assignments`, { headers }),
        fetch(`${API_BASE}/student/my-payments`, { headers })
      ]);

      const coursesData = coursesRes.ok ? await coursesRes.json() : [];
      const attendanceData = attendanceRes.ok ? await attendanceRes.json() : [];
      const resultsData = resultsRes.ok ? await resultsRes.json() : [];
      const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : [];
      const paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];

      setCourses(coursesData);
      setAttendance(attendanceData);
      setResults(resultsData);
      setAssignments(assignmentsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Calculate stats
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;
  const pendingPayments = payments.filter(p => p.status === 'Pending');

  // Hardcoded class routines for BD Grade 5 / 8 curriculum
  const classRoutine = user?.class === '5' ? [
    { day: 'Saturday', subjects: ['Mathematics - 4:00 PM', 'ICT Lab - 5:30 PM'] },
    { day: 'Sunday', subjects: ['English - 4:00 PM', 'Bangla - 5:30 PM'] },
    { day: 'Tuesday', subjects: ['English - 4:00 PM', 'Science - 5:30 PM'] },
    { day: 'Wednesday', subjects: ['Mathematics - 4:00 PM', 'Science - 5:30 PM'] },
  ] : [
    { day: 'Saturday', subjects: ['General Science - 5:30 PM', 'ICT Lab - 7:00 PM'] },
    { day: 'Monday', subjects: ['Mathematics - 5:30 PM', 'English - 7:00 PM'] },
    { day: 'Wednesday', subjects: ['General Science - 5:30 PM', 'Bangla - 7:00 PM'] },
    { day: 'Thursday', subjects: ['Mathematics - 5:30 PM', 'English - 7:00 PM'] },
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <style>{`
        .dashboard-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-btn {
          width: 100%;
          text-align: left;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sidebar-btn:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .sidebar-btn.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .dashboard-stat-card {
          padding: 1.5rem;
          text-align: center;
        }
        .dashboard-stat-card h3 {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .tab-content {
          padding: 2rem;
          min-height: 400px;
        }
        .routine-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }
        .routine-row:last-child {
          border-bottom: none;
        }
        .routine-day {
          font-weight: 700;
          color: var(--primary);
        }
        .routine-subjects {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .routine-sub-pill {
          background-color: var(--bg-tertiary);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .dashboard-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Portal Greeting Banner */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className={`badge ${user?.class === '5' ? 'badge-grade5' : 'badge-grade8'}`} style={{ marginBottom: '0.5rem' }}>
            Grade {user?.class || 'N/A'} Student
          </span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)' }}>Hello, {user?.name}!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Welcome to your academic coaching portal. Access study materials, routines, and grades.</p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} />
          <span>Sync Data</span>
        </button>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Nav */}
        <div className="sidebar">
          <button className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <User size={16} />
            <span>Overview</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'routine' ? 'active' : ''}`} onClick={() => setActiveTab('routine')}>
            <Calendar size={16} />
            <span>Class Routine</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <GraduationCap size={16} />
            <span>Exam Results</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
            <ClipboardList size={16} />
            <span>Assignments</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>
            <Landmark size={16} />
            <span>Fees & Billing</span>
          </button>
        </div>

        {/* Dynamic Portal Tabs */}
        <div className="glass-card tab-content">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
              Syncing profile records...
            </div>
          ) : (
            <>
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Academic Summary</h3>
                  
                  <div className="stats-grid">
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--primary)' }}>{courses.length}</h3>
                      <p>Enrolled Courses</p>
                    </div>
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--success)' }}>{attendanceRate}%</h3>
                      <p>Attendance Record</p>
                    </div>
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: pendingPayments.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                        {pendingPayments.length}
                      </h3>
                      <p>Pending Fee Invoices</p>
                    </div>
                  </div>

                  {pendingPayments.length > 0 && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--danger)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '2rem',
                      fontSize: '0.9rem'
                    }}>
                      <AlertCircle size={20} />
                      <span>
                        You have <strong>{pendingPayments.length} pending course enrollment invoices</strong>. Please contact the accounts office (+880 1700-000000) or verify payments below.
                      </span>
                    </div>
                  )}

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    Profile Registration Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div><strong>Email:</strong> {user?.email}</div>
                    <div><strong>Phone:</strong> {user?.phone || 'Not provided'}</div>
                    <div><strong>Guardian Name:</strong> {user?.studentDetails?.guardianInfo?.name || 'Not provided'}</div>
                    <div><strong>Guardian Contact:</strong> {user?.studentDetails?.guardianInfo?.phone || 'Not provided'}</div>
                  </div>
                </div>
              )}

              {/* Tab 2: Routine */}
              {activeTab === 'routine' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Weekly Class Schedule</h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {classRoutine.map((item, idx) => (
                      <div key={idx} className="routine-row">
                        <span className="routine-day">{item.day}</span>
                        <div className="routine-subjects">
                          {item.subjects.map((sub, i) => (
                            <span key={i} className="routine-sub-pill">{sub}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Results */}
              {activeTab === 'results' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Board Exam & Model Test Grade Cards</h3>
                  
                  {results.length > 0 ? (
                    results.map((res) => (
                      <div key={res._id} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{res.examName}</h4>
                          <span className="badge badge-grade8">Overall Grade: {res.overallGrade}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                          {res.marks.map((m, idx) => (
                            <div key={idx} style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.subject}</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{m.mark}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No exam result cards published yet for this student.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Assignments */}
              {activeTab === 'assignments' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Assignments & Study Materials</h3>
                  
                  {assignments.length > 0 ? (
                    assignments.map((asg) => (
                      <div key={asg._id} className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: '4px solid var(--accent)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{asg.title}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 600 }}>
                            Deadline: {new Date(asg.deadline).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                          {asg.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Course: {asg.courseId?.title}
                          </span>
                          
                          <button 
                            onClick={() => alert('Downloading PDF study guide...')}
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                          >
                            <FileDown size={12} />
                            <span>Download Study Materials PDF</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No assignments pending. Enjoy your study week!
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Payments */}
              {activeTab === 'payments' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Enrollment Fees & Invoice Ledger</h3>
                  
                  {payments.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '0.75rem 0.5rem' }}>Transaction ID</th>
                            <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                            <th style={{ padding: '0.75rem 0.5rem' }}>Date Issued</th>
                            <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p) => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'monospace' }}>{p.transactionId}</td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>{p.amount} BDT</td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>{new Date(p.paymentDate).toLocaleDateString('en-GB')}</td>
                              <td style={{ padding: '0.75rem 0.5rem' }}>
                                <span className={`badge ${p.status === 'Completed' ? 'badge-grade5' : 'badge-grade8'}`} style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      No fee records found.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
