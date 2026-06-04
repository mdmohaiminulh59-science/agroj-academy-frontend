import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ShieldAlert, Key } from 'lucide-react';

const Login = () => {
  const { login, isMock } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      // Determine dashboard redirect based on email or user details
      if (email.startsWith('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (mockEmail) => {
    setError('');
    setSubmitting(true);
    try {
      await login(mockEmail, 'password123');
      if (mockEmail.startsWith('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Quick login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '2rem 1.5rem',
      background: 'radial-gradient(circle at 10% 20%, var(--primary-light) 0%, transparent 40%)'
    }}>
      <style>{`
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
        }
        .form-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-wrapper input {
          width: 100%;
          padding-left: 2.5rem;
        }
        .input-icon {
          position: absolute;
          left: 10px;
          color: var(--text-muted);
        }
        .mock-box {
          border-top: 1px dashed var(--border-color);
          margin-top: 2rem;
          padding-top: 1.5rem;
        }
        .mock-btn {
          width: 100%;
          padding: 0.5rem;
          font-size: 0.8rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }
        .mock-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
      `}</style>

      <div className="glass-card login-card animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <GraduationCap size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to your Academic Portal</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                placeholder="student@excellencecoaching.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          New student? <Link to="/admissions" style={{ color: 'var(--primary)', fontWeight: 600 }}>Apply Online</Link>
        </p>

        {/* Developer Mock Quick Login Options */}
        {isMock && (
          <div className="mock-box">
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Key size={14} style={{ color: 'var(--accent)' }} />
              <span>Developer Sandbox (Quick Login)</span>
            </h4>
            <button className="mock-btn" onClick={() => handleQuickLogin('admin@test.com')}>
              <span>Sign in as <strong>Admin</strong> (Full CRUD panel)</span>
              <span>admin@test.com &rarr;</span>
            </button>
            <button className="mock-btn" onClick={() => handleQuickLogin('student5@test.com')}>
              <span>Sign in as <strong>Grade 5 Student</strong></span>
              <span>student5@test.com &rarr;</span>
            </button>
            <button className="mock-btn" onClick={() => handleQuickLogin('student8@test.com')}>
              <span>Sign in as <strong>Grade 8 Student</strong></span>
              <span>student8@test.com &rarr;</span>
            </button>
            <button className="mock-btn" onClick={() => handleQuickLogin('teacher@test.com')}>
              <span>Sign in as <strong>Teacher</strong></span>
              <span>teacher@test.com &rarr;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
