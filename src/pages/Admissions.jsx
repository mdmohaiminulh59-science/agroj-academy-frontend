import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, Mail, Lock, User, Phone, Book } from 'lucide-react';

const Admissions = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    studentClass: '5',
    guardianName: '',
    guardianPhone: '',
    relationship: 'Father'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone,
        formData.studentClass
      );

      // Successfully registered. We'll update guardian details on profile manually
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');

      await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          guardianInfo: {
            name: formData.guardianName,
            phone: formData.guardianPhone,
            relationship: formData.relationship
          }
        })
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(circle at 90% 80%, var(--primary-light) 0%, transparent 45%)'
    }}>
      <style>{`
        .admission-card {
          width: 100%;
          max-width: 650px;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
        }
        .form-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 600px) {
          .form-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="glass-card admission-card animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <GraduationCap size={44} style={{ color: 'var(--accent)', margin: '0 auto 0.75rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Online Admission</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in details to enroll in Grade 5 / Grade 8 batches</p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section 1: Academic details */}
          <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
            1. Student Information
          </h4>
          
          <div className="form-section">
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Student Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="student@test.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
              <div className="input-wrapper">
                <Phone size={16} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="017xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enrolling Class / Grade</label>
            <select 
              value={formData.studentClass} 
              onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="5">Grade 5 (Primary School Completion)</option>
              <option value="8">Grade 8 (Junior School Certificate)</option>
            </select>
          </div>

          {/* Section 2: Guardian details */}
          <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '1rem', color: 'var(--primary)' }}>
            2. Guardian Information
          </h4>

          <div className="form-section">
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Guardian Name</label>
              <input 
                type="text" 
                placeholder="Father/Mother Name"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                required 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Guardian Phone</label>
              <input 
                type="text" 
                placeholder="Guardian Contact No."
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Relationship</label>
            <select 
              value={formData.relationship} 
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Guardian">Legal Guardian</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem', gap: '0.5rem' }}
            disabled={loading}
          >
            <ShieldCheck size={18} />
            <span>{loading ? 'Submitting Application...' : 'Submit Admission Form'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admissions;
