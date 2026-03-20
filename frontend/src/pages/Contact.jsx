import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const contacts = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: "Email",
      lines: ["support@cems.edu"],
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.37 2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      label: "Phone",
      lines: ["+91 98765 43210"],
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      ),
      label: "Office",
      lines: ["College Campus, Block A", "Room 204, Admin Block", "Indore, MP 452001"],
    },
  ];

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* HEADER */}
        <div className="contact-header">
          <h1 className="contact-heading">Get in Touch</h1>
          <p className="contact-subheading">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="contact-layout">
          {/* LEFT — CONTACT INFO */}
          <div className="contact-info-col">
            {contacts.map((c, i) => (
              <div className="contact-info-card" key={i} style={{ animationDelay:`${i*0.1}s` }}>
                <div className="contact-info-icon">{c.icon}</div>
                <div className="contact-info-text">
                  <span className="contact-info-label">{c.label}</span>
                  {c.lines.map((l, j) => <span key={j} className="contact-info-value">{l}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — FORM */}
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button className="contact-back-btn" onClick={() => setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label className="contact-label">Full Name</label>
                    <input className="contact-input" type="text" placeholder="John Doe"
                      value={form.name} onChange={e => setForm({...form, name:e.target.value})} required/>
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Email</label>
                    <input className="contact-input" type="email" placeholder="john@example.com"
                      value={form.email} onChange={e => setForm({...form, email:e.target.value})} required/>
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Subject</label>
                  <input className="contact-input" type="text" placeholder="How can we help?"
                    value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} required/>
                </div>

                <div className="contact-field">
                  <label className="contact-label">Message</label>
                  <textarea className="contact-textarea" placeholder="Tell us more about your inquiry..."
                    value={form.message} onChange={e => setForm({...form, message:e.target.value})} required/>
                </div>

                <button type="submit" className="contact-submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="contact-btn-spinner"/>Sending...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;