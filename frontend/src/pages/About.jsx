import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate();

  const developers = [
    {
      name: "Deeksha Garg",
      role: "MCA, I Year",
      initials: <img className="abt_img" src="src\pages\deeksha1.jpeg" alt="deeksha" />,
      color: "#2563eb",
      linkedin: "https://www.linkedin.com/in/deeksha-garg-abab80284",
      github: "https://github.com/deekshagarg1",
      email: "officialdeekshagarg@gmail.com",
    },
    {
      name: "Pulkit Mishra",
      role: "MCA, I Year",
      initials: <img className="abt_img" src="src\pages\pulkit1.jpeg" alt="pulkit" />,
      color: "#7c3aed",
      linkedin: "https://www.linkedin.com/in/pulkit-mishra-97a38132b",
      github: "https://github.com/pulkit100",
      email: "mishrapulkit715@gmail.com",
    },
  ];

  return (
    <div className="about-page">




      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="about-badge">About CEMS</div>
          <h1 className="about-hero-title">
            Campus Event<br/>
            <span className="about-hero-accent">Management System</span>
          </h1>
          <p className="about-hero-desc">
            A powerful platform designed to simplify how students discover, register, and participate in campus events — and how faculty create and manage them.
          </p>
          <div className="about-hero-btns">
            <button className="about-btn-primary" onClick={() => navigate("/events")}>Explore Events</button>
            <button className="about-btn-secondary" onClick={() => navigate("/sign")}>Get Started</button>
          </div>
        </div>
      </section>


       {/* ===== DEVELOPED BY ===== */}
      <section className="team-section">
        <div className="team-container">
          <h2 className="team-heading">Developed by</h2>

          <div className="developers-grid">
            {developers.map((dev, i) => (
              <div className="dev-card" key={i} style={{ animationDelay:`${i * 0.12}s` }}>
                <div className="dev-avatar" style={{ background: `linear-gradient(135deg, ${dev.color}, ${dev.color}bb)` }}>
                  <span>{dev.initials}</span>
                  <div className="dev-avatar-ring"/>
                </div>
                <h3 className="dev-name">{dev.name}</h3>
                <p className="dev-role">{dev.role}</p>
                <div className="dev-links">
                  <a href={dev.linkedin} className="dev-link dev-link-li" title="LinkedIn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                  <a href={dev.github} className="dev-link dev-link-gh" title="GitHub">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                  </a>
                  <a href={`mailto:${dev.email}`} className="dev-link dev-link-mail" title="Email">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* GUIDANCE */}
          <div className="guidance-section">
            <h3 className="guidance-heading">Built under the guidance of</h3>
            <div className="guidance-card">
              <div className="guide-avatar guide-avatar-main">
                <span><img className="abt_img" src="src\pages\pulkit1.jpeg" alt="rs" /></span>
                <div className="guide-ring"/>
              </div>
              <div className="guide-info">
                <h4 className="guide-name">Prof. R.S. Jadon</h4>
                <p className="guide-role">Faculty Guide · MCA Department</p>
                <p className="guide-inst">MITS University</p>
              </div>
            </div>
          </div>

          {/* INSTITUTION */}
          <div className="institution-section">
            <div className="inst-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Madhya Pradesh Institute of Technology & Science (MITS)
            </div>
          </div>

        </div>
      </section>

      {/* ===== BUILT FOR STUDENTS ===== */}
      <section className="built-section">
        <div className="built-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2 className="built-title">Built for Students, By Students</h2>
        <p className="built-desc">
          Our platform is developed with input from students, faculty, and event coordinators to ensure it meets the real needs of campus communities.
        </p>
      </section>

      {/* ===== MISSION ===== */}
      <section className="mission-section">
        <div className="mission-grid">
          <div className="mission-card" style={{ animationDelay:"0s" }}>
            <div className="mission-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To create a seamless bridge between students and campus events — making discovery, registration, and participation effortless for everyone.</p>
          </div>
          <div className="mission-card" style={{ animationDelay:"0.1s" }}>
            <div className="mission-icon">💡</div>
            <h3>Our Vision</h3>
            <p>A fully connected campus where no student misses an opportunity to learn, grow, and participate in events that shape their future.</p>
          </div>
          <div className="mission-card" style={{ animationDelay:"0.2s" }}>
            <div className="mission-icon">🚀</div>
            <h3>Our Goal</h3>
            <p>Empower faculty to create impactful events and students to register with one click — all under one unified, smart platform.</p>
          </div>
        </div>
      </section>

     

    </div>
  );
}

export default About;