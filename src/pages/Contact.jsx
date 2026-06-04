import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1.2fr 1.8fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .info-card {
          padding: 2.5rem;
          height: 100%;
        }
        .contact-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .contact-item-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-form-card {
          padding: 2.5rem;
        }
        .map-container {
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
          height: 350px;
        }
        @media (max-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Get in Touch</h1>
        <p style={{ color: 'var(--text-muted)' }}>Have a question? Feel free to contact our support desk or visit our Dhanmondi campus.</p>
      </div>

      <div className="contact-layout">
        {/* Info Left */}
        <div className="glass-card info-card">
          <h3 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Contact Information</h3>

          <div className="contact-item">
            <div className="contact-item-icon">
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Location</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>House 42, Road 11, Dhanmondi, Dhaka-1209, Bangladesh</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Phone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Phone Numbers</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>+880 1700-000000 (Office)<br />+880 1900-000000 (Admin)</p>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-item-icon">
              <Mail size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Email Support</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>info@excellencecoaching.bd<br />support@excellencecoaching.bd</p>
            </div>
          </div>
        </div>

        {/* Form Right */}
        <div className="glass-card contact-form-card">
          {submitted ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <CheckCircle2 size={56} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Message Submitted!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
                Thank you for reaching out. A representative from our team will phone or email you within 24 hours.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Send Us a Message</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Ahmed Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="ahmed@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="01712345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Message</label>
                <textarea 
                  rows="4" 
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', gap: '0.5rem' }}>
                <Send size={16} />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Map */}
      <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>Campus Location Map</h3>
      <div className="map-container">
        <iframe 
          title="Google Map Location"
          src="https://www.google.com/maps/embed?pb=!11m18!1m12!1m3!1d3652.1702581699923!2d90.37000577595568!3d23.741272989104085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b28ab96d75%3A0xa6c968f77d33ef4a!2sDhanmondi%20Lake%20Park!5e0!3m2!1sen!2sbd!4v1717462000000!5m2!1sen!2sbd" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
