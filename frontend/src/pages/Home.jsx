// import { Link } from "react-router-dom";
// import "../assets/css/Home.css";

// function Home(){

// return(

// <div className="home">

// <div className="hero">

// <h1>College Event Management System</h1>

// <p>
// Streamline your campus events with our platform.
// Create, manage and participate in events easily.
// </p>

// <Link to='events'><button >Browse Events</button></Link>


// </div>

// </div>

// );

// }

// export default Home;

import { useNavigate } from "react-router-dom";
// import "./Home.css";
import "../assets/css/Home.css";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: "Event Discovery",
    desc: "Browse and search upcoming events across all departments and categories.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: "Easy Registration",
    desc: "Simple one-click registration process for students and faculty members.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Attendance Tracking",
    desc: "QR code-based attendance system for accurate event participation tracking.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: "Digital Certificates",
    desc: "Automatic certificate generation and distribution for event participants.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    title: "Analytics Dashboard",
    desc: "Comprehensive insights and reports on event performance and engagement.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Feedback System",
    desc: "Collect and analyze participant feedback to improve future events.",
  },
];

const steps = [
  { num: "1", title: "Sign Up", desc: "Create your account with your college email" },
  { num: "2", title: "Browse Events", desc: "Explore upcoming events and activities" },
  { num: "3", title: "Register", desc: "Register for events that interest you" },
  { num: "4", title: "Participate", desc: "Attend events and earn certificates" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🎓 Campus Event Management</div>
          <h1 className="hero-title">
            College Event<br />
            <span className="hero-title-accent">Management System</span>
          </h1>
          <p className="hero-desc">
            Streamline your campus events with our platform.<br />
            Create, manage and participate in events easily.
          </p>
          <div className="hero-actions">
            <button className="hero-btn-primary" onClick={() => navigate("/events")}>
              Browse Events
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="hero-btn-secondary" onClick={() => navigate("/sign")}>
              Create Account
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span className="hero-stat-num">500+</span><span className="hero-stat-label">Events</span></div>
            <div className="hero-stat-divider"/>
            <div className="hero-stat"><span className="hero-stat-num">5K+</span><span className="hero-stat-label">Students</span></div>
            <div className="hero-stat-divider"/>
            <div className="hero-stat"><span className="hero-stat-num">100+</span><span className="hero-stat-label">Faculty</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float hero-card-1">
            <div className="hcf-icon">📅</div>
            <div><div className="hcf-title">AI Workshop</div><div className="hcf-sub">Tomorrow · 10 AM</div></div>
          </div>
          <div className="hero-card-float hero-card-2">
            <div className="hcf-icon">🎭</div>
            <div><div className="hcf-title">Cultural Fest</div><div className="hcf-sub">387 registered</div></div>
          </div>
          <div className="hero-card-float hero-card-3">
            <div className="hcf-icon">✅</div>
            <div><div className="hcf-title">Registered!</div><div className="hcf-sub">Startup Pitch</div></div>
          </div>
          <div className="hero-blob"/>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Manage Events</h2>
          <p className="section-subtitle">A complete solution for organizing, tracking, and analyzing campus events</p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="how-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Simple steps to get started with event management</p>
        </div>

        <div className="steps-wrapper">
          {/* Connecting line */}
          <div className="steps-line"/>
          <div className="steps-row">
            {steps.map((s, i) => (
              <div className="step-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-circle">
                  <span>{s.num}</span>
                  <div className="step-ring"/>
                </div>
                <h4 className="step-title">{s.title}</h4>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <div className="cta-glow"/>
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">Join thousands of students and faculty already using our platform</p>
          <div className="cta-actions">
            <button className="cta-btn-primary" onClick={() => navigate("/sign")}>
              Create Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="cta-btn-secondary" onClick={() => navigate("/events")}>
              Learn More
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;