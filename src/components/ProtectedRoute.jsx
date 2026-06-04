import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <style>{`
          @keyframes spin-pulse {
            0% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.1) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
          }
          .loader-spin {
            animation: spin-pulse 2s infinite ease-in-out;
            color: var(--accent);
          }
        `}</style>
        <GraduationCap size={64} className="loader-spin" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-title)', fontWeight: 600 }}>Loading Portal...</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Verifying security credentials</p>
      </div>
    );
  }

  if (!user) {
    // Save current path for redirect after login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
