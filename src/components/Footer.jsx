import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Youtube, Send, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto',
      position: 'relative'
    }}>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-brand h3 {
          font-family: var(--font-title);
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }
        .footer-brand p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .footer-links h4 {
          font-family: var(--font-title);
          font-size: 1.05rem;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-links ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .footer-links a:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .footer-socials {
          display: flex;
          gap: 1rem;
        }
        .social-icon {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .social-icon:hover {
          background-color: var(--primary);
          color: white;
          transform: translateY(-2px);
        }
        .whatsapp-float {
          position: fixed;
          bottom: 25px;
          right: 25px;
          background-color: #25d366;
          color: white;
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(37, 211, 102, 0.4);
          z-index: 99;
          transition: all 0.3s;
        }
        .whatsapp-float:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 15px rgba(37, 211, 102, 0.6);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      {/* Floating WhatsApp contact button */}
      <a 
        href="https://wa.me/8801700000000" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>

      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>Academic Excellence Coaching</h3>
            <p>Empowering Grade 5 and Grade 8 students in Bangladesh to achieve academic brilliance through curated resources, interactive routines, and experienced teachers.</p>
            <div className="footer-socials">
              <a href="#" className="social-icon"><Facebook size={18} /></a>
              <a href="#" className="social-icon"><Youtube size={18} /></a>
              <a href="#" className="social-icon"><Send size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Sitemap</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          {/* Academic Info */}
          <div className="footer-links">
            <h4>Academic</h4>
            <ul>
              <li><Link to="/notices">Notice Board</Link></li>
              <li><Link to="/blog">Study Tips Blog</Link></li>
              <li><Link to="/admissions">Online Admission</Link></li>
              <li><Link to="/login">Student Login</Link></li>
            </ul>
          </div>

          {/* Direct Contacts */}
          <div className="footer-links" style={{ color: 'var(--text-secondary)' }}>
            <h4>Contact Info</h4>
            <ul style={{ gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                <MapPin size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span>House 42, Road 11, Dhanmondi, Dhaka, Bangladesh</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--accent)' }} />
                <span>+880 1700-000000</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                <span>info@excellencecoaching.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          &copy; {new Date().getFullYear()} Academic Excellence Coaching. All Rights Reserved. Designed for Grade 5 & Grade 8 Excellence in BD.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
