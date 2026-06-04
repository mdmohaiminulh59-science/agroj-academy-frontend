import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Calendar, BookOpen, GraduationCap, Landmark, 
  PlusCircle, RefreshCw, FileText, Check, Trash2, ShieldCheck, Megaphone, ArrowUpRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, totalRevenue: 0, pendingPaymentsCount: 0, averageAttendanceRate: 100 });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [studentForm, setStudentForm] = useState({ userId: '', class: '5', guardianName: '', guardianPhone: '', relationship: 'Father' });
  const [attendanceForm, setAttendanceForm] = useState({ studentEmail: '', date: '', status: 'Present' });
  const [resultForm, setResultForm] = useState({ studentEmail: '', examName: '', mathMark: 80, englishMark: 85, overallGrade: 'A+' });
  const [courseForm, setCourseForm] = useState({ title: '', class: '5', description: '', syllabusStr: '', fee: 2000, schedule: '', teacherId: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', description: '', category: 'academic' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', tagsStr: '', imageUrl: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', qualification: '', experience: '', subject: '', photoUrl: '' });
  
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [statsRes, studentsRes, teachersRes, coursesRes, paymentsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, { headers }),
        fetch(`${API_BASE}/admin/students`, { headers }),
        fetch(`${API_BASE}/admin/teachers`, { headers }),
        fetch(`${API_BASE}/courses`, { headers }),
        fetch(`${API_BASE}/admin/payments`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (teachersRes.ok) setTeachers(await teachersRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (paymentsRes.ok) setPayments(await paymentsRes.json());

    } catch (err) {
      console.error('Failed to sync admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const displayMessage = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: '', text: '' }), 5000);
  };

  const handleMongoosePost = async (endpoint, body) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        displayMessage('success', 'Operation completed successfully!');
        fetchAdminData();
      } else {
        displayMessage('error', data.message || 'Operation failed.');
      }
    } catch (err) {
      displayMessage('error', 'Server connection error.');
    }
  };

  // 1. Assign student class
  const submitStudentClass = (e) => {
    e.preventDefault();
    handleMongoosePost('/admin/students/setup-class', studentForm);
  };

  // 2. Mark student attendance
  const submitAttendance = (e) => {
    e.preventDefault();
    handleMongoosePost('/admin/attendance', attendanceForm);
  };

  // 3. Publish results
  const submitResult = (e) => {
    e.preventDefault();
    const payload = {
      studentEmail: resultForm.studentEmail,
      examName: resultForm.examName,
      overallGrade: resultForm.overallGrade,
      marks: [
        { subject: 'Mathematics', mark: resultForm.mathMark },
        { subject: 'English', mark: resultForm.englishMark }
      ]
    };
    handleMongoosePost('/results', payload);
  };

  // 4. Create course
  const submitCourse = (e) => {
    e.preventDefault();
    const payload = {
      ...courseForm,
      syllabus: courseForm.syllabusStr.split(',').map(s => s.trim())
    };
    handleMongoosePost('/courses', payload);
  };

  // 5. Create notice
  const submitNotice = (e) => {
    e.preventDefault();
    handleMongoosePost('/notices', noticeForm);
  };

  // 6. Create blog
  const submitBlog = (e) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      tags: blogForm.tagsStr.split(',').map(t => t.trim())
    };
    handleMongoosePost('/blogs', payload);
  };

  // 7. Create teacher profile
  const submitTeacher = (e) => {
    e.preventDefault();
    handleMongoosePost('/admin/teachers', teacherForm);
  };

  // 8. Resolve Payment Invoice
  const resolvePayment = async (paymentId, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`${API_BASE}/admin/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        displayMessage('success', `Invoice status marked as ${nextStatus}`);
        fetchAdminData();
      } else {
        displayMessage('error', 'Failed to resolve invoice.');
      }
    } catch (err) {
      displayMessage('error', 'Connection error.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <style>{`
        .admin-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 2rem;
        }
        .admin-form-box {
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Greeting Header */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-grade8" style={{ marginBottom: '0.5rem', backgroundColor: 'var(--accent)', color: 'white' }}>
            System Administrator
          </span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)' }}>Admin Console</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Publish results, manage courses, track student attendance, and monitor fee payments.</p>
        </div>
        <button onClick={fetchAdminData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} />
          <span>Sync Database</span>
        </button>
      </div>

      {alertMsg.text && (
        <div style={{
          backgroundColor: alertMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: alertMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          fontSize: '0.9rem'
        }}>
          {alertMsg.text}
        </div>
      )}

      <div className="admin-grid">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <button className={`sidebar-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Users size={16} />
            <span>Analytics Dashboard</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <GraduationCap size={16} />
            <span>Student Manager</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
            <Users size={16} />
            <span>Teachers Panel</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <BookOpen size={16} />
            <span>Course Creator</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <FileText size={16} />
            <span>Publish Results</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            <Calendar size={16} />
            <span>Attendance Checker</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'notices' ? 'active' : ''}`} onClick={() => setActiveTab('notices')}>
            <Megaphone size={16} />
            <span>Notices & Blogs</span>
          </button>
          <button className={`sidebar-btn ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
            <Landmark size={16} />
            <span>Billing & Payments</span>
          </button>
        </div>

        {/* Dynamic Admin Panels */}
        <div className="glass-card tab-content">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
              Querying administrative aggregates...
            </div>
          ) : (
            <>
              {/* Tab 1: Analytics */}
              {activeTab === 'analytics' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Management Aggregates</h3>
                  <div className="stats-grid">
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--primary)' }}>{stats.totalStudents}</h3>
                      <p>Total Registered Students</p>
                    </div>
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--primary)' }}>{stats.totalTeachers}</h3>
                      <p>Teacher Profiles</p>
                    </div>
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--primary)' }}>{stats.totalCourses}</h3>
                      <p>Active Course Packages</p>
                    </div>
                    <div className="glass-card dashboard-stat-card">
                      <h3 style={{ color: 'var(--success)' }}>{stats.totalRevenue} BDT</h3>
                      <p>Total Revenue Recieved</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Attendance Rate</h4>
                      <h3 style={{ fontSize: '2.2rem', color: 'var(--success)', fontWeight: 800 }}>{stats.averageAttendanceRate}%</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average attendance marked across active students in all classes.</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Pending Fees Invoices</h4>
                      <h3 style={{ fontSize: '2.2rem', color: 'var(--accent)', fontWeight: 800 }}>{stats.pendingPaymentsCount}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unpaid enrollment invoices awaiting review.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Students List & Setup Class */}
              {activeTab === 'students' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Assign Class Room Grade</h3>
                  
                  {/* Setup Grade form */}
                  <form onSubmit={submitStudentClass} className="glass-card admin-form-box">
                    <div className="form-grid-2">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Mongoose Student User ID</label>
                        <input 
                          type="text" 
                          placeholder="Mongoose User _id" 
                          value={studentForm.userId}
                          onChange={(e) => setStudentForm({ ...studentForm, userId: e.target.value })}
                          required 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Grade Class</label>
                        <select 
                          value={studentForm.class} 
                          onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                        >
                          <option value="5">Grade 5</option>
                          <option value="8">Grade 8</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Guardian Name</label>
                        <input 
                          type="text" 
                          placeholder="Parent name"
                          value={studentForm.guardianName}
                          onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Guardian Phone</label>
                        <input 
                          type="text" 
                          placeholder="Parent contact number"
                          value={studentForm.guardianPhone}
                          onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                      Assign Class & Save Profile
                    </button>
                  </form>

                  {/* Student Roster */}
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Enrolled Student Roster</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                          <th style={{ padding: '0.5rem' }}>Student Name</th>
                          <th style={{ padding: '0.5rem' }}>Email / Phone</th>
                          <th style={{ padding: '0.5rem' }}>User ID</th>
                          <th style={{ padding: '0.5rem' }}>Grade</th>
                          <th style={{ padding: '0.5rem' }}>Enrolled Subjects</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((st) => (
                          <tr key={st._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 700 }}>{st.studentId?.name || 'N/A'}</td>
                            <td style={{ padding: '0.5rem' }}>{st.studentId?.email}<br />{st.studentId?.phone || 'No phone'}</td>
                            <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{st.studentId?._id}</td>
                            <td style={{ padding: '0.5rem' }}>
                              <span className={`badge ${st.class === '5' ? 'badge-grade5' : 'badge-grade8'}`}>
                                G-{st.class}
                              </span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              {st.enrolledCourses?.map(c => c.title).join(', ') || 'No subject enrolled'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Teachers Panel */}
              {activeTab === 'teachers' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Teacher Profiles Management</h3>
                  
                  <form onSubmit={submitTeacher} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-grid-2">
                      <input 
                        type="text" 
                        placeholder="Teacher Full Name" 
                        value={teacherForm.name} 
                        onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Qualification (e.g. BSc in CSE, BUET)" 
                        value={teacherForm.qualification} 
                        onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-grid-2">
                      <input 
                        type="text" 
                        placeholder="Subject Specialization (e.g. Mathematics)" 
                        value={teacherForm.subject} 
                        onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })} 
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Experience (e.g. 5+ Years)" 
                        value={teacherForm.experience} 
                        onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })} 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Create Teacher Profile
                    </button>
                  </form>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {teachers.map((t) => (
                      <div key={t._id} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                        <h4 style={{ fontWeight: 700 }}>{t.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{t.subject} Specialist</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.qualification}</p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.5rem' }}>
                          ID: {t._id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Course Creator */}
              {activeTab === 'courses' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Create Course Package</h3>
                  
                  <form onSubmit={submitCourse} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-grid-2">
                      <input 
                        type="text" 
                        placeholder="Course Title (e.g. English Grammar Grade 8)" 
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        required 
                      />
                      <select 
                        value={courseForm.class} 
                        onChange={(e) => setCourseForm({ ...courseForm, class: e.target.value })}
                      >
                        <option value="5">Grade 5</option>
                        <option value="8">Grade 8</option>
                      </select>
                    </div>

                    <textarea 
                      placeholder="Course Description" 
                      rows="3"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      required
                    />

                    <input 
                      type="text" 
                      placeholder="Syllabus Highlights (comma-separated, e.g. Fractions, Division, Decimals)" 
                      value={courseForm.syllabusStr}
                      onChange={(e) => setCourseForm({ ...courseForm, syllabusStr: e.target.value })}
                    />

                    <div className="form-grid-2">
                      <input 
                        type="number" 
                        placeholder="Monthly Fee (BDT)" 
                        value={courseForm.fee}
                        onChange={(e) => setCourseForm({ ...courseForm, fee: Number(e.target.value) })}
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Schedule (e.g. Mon, Thu - 4:00 PM)" 
                        value={courseForm.schedule}
                        onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })}
                        required 
                      />
                    </div>

                    <input 
                      type="text" 
                      placeholder="Teacher Profile ID (Mongoose ObjectId)" 
                      value={courseForm.teacherId}
                      onChange={(e) => setCourseForm({ ...courseForm, teacherId: e.target.value })}
                      required 
                    />

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Publish Course
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 5: Publish Results */}
              {activeTab === 'results' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Publish Exam Grade Sheet</h3>
                  
                  <form onSubmit={submitResult} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-grid-2">
                      <input 
                        type="email" 
                        placeholder="Student Registered Email" 
                        value={resultForm.studentEmail}
                        onChange={(e) => setResultForm({ ...resultForm, studentEmail: e.target.value })}
                        required 
                      />
                      <input 
                        type="text" 
                        placeholder="Exam Name (e.g. Term 1 Model Test)" 
                        value={resultForm.examName}
                        onChange={(e) => setResultForm({ ...resultForm, examName: e.target.value })}
                        required 
                      />
                    </div>

                    <div className="form-grid-2">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem' }}>Mathematics Mark (Out of 100)</label>
                        <input 
                          type="number" 
                          value={resultForm.mathMark}
                          onChange={(e) => setResultForm({ ...resultForm, mathMark: Number(e.target.value) })}
                          required 
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.8rem' }}>English Mark (Out of 100)</label>
                        <input 
                          type="number" 
                          value={resultForm.englishMark}
                          onChange={(e) => setResultForm({ ...resultForm, englishMark: Number(e.target.value) })}
                          required 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem' }}>Overall Grade</label>
                      <select 
                        value={resultForm.overallGrade}
                        onChange={(e) => setResultForm({ ...resultForm, overallGrade: e.target.value })}
                      >
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Publish Transcript
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 6: Attendance Checker */}
              {activeTab === 'attendance' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Mark Student Attendance</h3>
                  
                  <form onSubmit={submitAttendance} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-grid-2">
                      <input 
                        type="email" 
                        placeholder="Student Email" 
                        value={attendanceForm.studentEmail}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, studentEmail: e.target.value })}
                        required 
                      />
                      <input 
                        type="date" 
                        value={attendanceForm.date}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                        required 
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem' }}>Attendance Status</label>
                      <select 
                        value={attendanceForm.status}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Submit Attendance Record
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 7: Notice and Blog creator */}
              {activeTab === 'notices' && (
                <div className="animate-fade-in">
                  {/* Notice Form */}
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Publish Board Announcement</h3>
                  <form onSubmit={submitNotice} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                    <input 
                      type="text" 
                      placeholder="Notice Title" 
                      value={noticeForm.title}
                      onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                      required 
                    />
                    <textarea 
                      placeholder="Details description" 
                      rows="3" 
                      value={noticeForm.description}
                      onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                      required 
                    />
                    <select 
                      value={noticeForm.category}
                      onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                    >
                      <option value="academic">Academic Class update</option>
                      <option value="exam">Exam Schedule Routine</option>
                      <option value="holiday">Holiday Closing</option>
                    </select>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Post Notice
                    </button>
                  </form>

                  {/* Blog Form */}
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Publish Study Guide / Blog</h3>
                  <form onSubmit={submitBlog} className="glass-card admin-form-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                      type="text" 
                      placeholder="Article Title" 
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      required 
                    />
                    <textarea 
                      placeholder="Content text blocks" 
                      rows="4" 
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      required 
                    />
                    <input 
                      type="text" 
                      placeholder="Tags (comma-separated, e.g. Math, Study Tips, Exam Prep)" 
                      value={blogForm.tagsStr}
                      onChange={(e) => setBlogForm({ ...blogForm, tagsStr: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      Publish Article
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 8: Billing Logs */}
              {activeTab === 'billing' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Fees Invoice Tracking</h3>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                          <th style={{ padding: '0.5rem' }}>Student Name</th>
                          <th style={{ padding: '0.5rem' }}>Amount</th>
                          <th style={{ padding: '0.5rem' }}>Transaction ID</th>
                          <th style={{ padding: '0.5rem' }}>Status</th>
                          <th style={{ padding: '0.5rem' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '0.5rem' }}>
                              <strong>{p.studentId?.name || 'N/A'}</strong><br />
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.studentId?.email}</span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>{p.amount} BDT</td>
                            <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{p.transactionId}</td>
                            <td style={{ padding: '0.5rem' }}>
                              <span className={`badge ${p.status === 'Completed' ? 'badge-grade5' : 'badge-grade8'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                              <button 
                                onClick={() => resolvePayment(p._id, p.status)}
                                className="btn btn-secondary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                              >
                                <Check size={10} />
                                <span>Toggle Pay Status</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
