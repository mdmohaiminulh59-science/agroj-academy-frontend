import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, GraduationCap, LogOut, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Notice Board', path: '/notices' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      backdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }}>
      <style>{`
        .dark nav {
          background-color: rgba(13, 19, 36, 0.7) !important;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-weight: 800;
          font-size: 1.3rem;
          color: var(--primary);
        }
        .dark .logo {
          color: var(--text-primary);
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-item {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .nav-item:hover, .nav-item.active {
          color: var(--primary);
        }
        .dark .nav-item:hover {
          color: var(--primary-hover);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .theme-btn, .mobile-toggle {
          padding: 0.5rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .theme-btn:hover, .mobile-toggle:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .mobile-menu {
          display: none;
        }
        @media (max-width: 992px) {
          .nav-menu {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>

      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="logo">
          <GraduationCap size={32} strokeWidth={2.5} style={{ color: 'var(--accent)' }} />
          <span>AEC <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Coaching</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-menu">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-item">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Navbar Right Side */}
        <div className="nav-actions">
          {/* Theme Switcher */}
          <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Operations */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link 
                to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                <LayoutDashboard size={16} />
                <span className="hide-mobile">Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/admissions" className="btn btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Enroll
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle"
            style={{ display: window.innerWidth <= 992 ? 'flex' : 'none' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="glass-card" style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          right: 0,
          borderLeft: 'none',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 1.5rem',
          gap: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="nav-item" 
              style={{ padding: '0.5rem 0' }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
