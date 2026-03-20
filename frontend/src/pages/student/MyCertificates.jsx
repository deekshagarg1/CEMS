import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken    = () => localStorage.getItem("token");
const getName     = () => localStorage.getItem("userName") || "Student";
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const COLLEGE     = "Madhav Institute of Technology & Science (MITS), Gwalior";

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "long", year: "numeric"
}) : "";

// ===== MINI CERTIFICATE PREVIEW =====
function CertificateCard({ event, studentName, index }) {
  const certRef  = useRef(null);
  const today    = new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" });
  const eventDate = event?.event_date ? formatDate(event.event_date) : today;

  const handleDownload = () => {
    const cert = certRef.current;
    if (!cert) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { background:#fff; }
          </style>
        </head>
        <body>
          ${cert.outerHTML}
          <script>
            window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 800); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="mycert-card" style={{ animationDelay:`${index * 0.08}s` }}>
      {/* Mini preview */}
      <div className="mycert-preview-wrap">
        <div className="mycert-preview-scale">
          <div ref={certRef} className="mycert-cert-full">
            <div className="mcc-outer">
              <div className="mcc-inner">
                <div className="mcc-corner mcc-tl">❧</div>
                <div className="mcc-corner mcc-tr">❧</div>
                <div className="mcc-corner mcc-bl">❧</div>
                <div className="mcc-corner mcc-br">❧</div>
                <div className="mcc-topline">
                  <div className="mcc-gold-line"/>
                  <div className="mcc-medal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                  <div className="mcc-gold-line"/>
                </div>
                <div className="mcc-college">{COLLEGE}</div>
                <div className="mcc-presents">presents this</div>
                <div className="mcc-main-title">Certificate of Participation</div>
                <div className="mcc-rule"><div className="mcc-rl"/><div className="mcc-rd">◆</div><div className="mcc-rl"/></div>
                <div className="mcc-body-text">This is to certify that</div>
                <div className="mcc-name-wrap">
                  <div className="mcc-nl"/><div className="mcc-student-name">{studentName}</div><div className="mcc-nl"/>
                </div>
                <div className="mcc-body-text">has successfully participated in</div>
                <div className="mcc-event-name">"{event?.title}"</div>
                <div className="mcc-body-text" style={{ marginTop:4 }}>
                  organized by <strong>{event?.creator_name || "MITS"}</strong> · held on <strong>{eventDate}</strong>
                </div>
                <div className="mcc-rule" style={{ marginTop:12 }}><div className="mcc-rl"/><div className="mcc-rd">◆</div><div className="mcc-rl"/></div>
                <div className="mcc-sigs">
                  <div className="mcc-sig"><div className="mcc-sig-line"/><div className="mcc-sig-title">Event Coordinator</div></div>
                  <div className="mcc-seal">
                    <div className="mcc-seal-c">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>MITS</span>
                    </div>
                  </div>
                  <div className="mcc-sig"><div className="mcc-sig-line"/><div className="mcc-sig-title">Head of Department</div></div>
                </div>
                <div className="mcc-issue">Issued on {today} · CEMS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="mycert-info">
        <div className="mycert-event-badge">🎓</div>
        <div className="mycert-text">
          <h3 className="mycert-event-title">{event?.title}</h3>
          <p className="mycert-event-date">📅 {eventDate}</p>
          {event?.location && <p className="mycert-event-loc">📍 {event.location}</p>}
          {event?.category && <span className="mycert-cat-badge">{event.category}</span>}
        </div>
        <button className="mycert-download-btn" onClick={handleDownload}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
function MyCertificates() {
  const navigate    = useNavigate();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const studentName = getName();

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    // Get registered events — these are all events student can have certificate for
    axios.get("http://localhost:5000/api/events/my-registrations", authHeaders())
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const pastEvents = events.filter(e => new Date(e.event_date) < new Date());

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 className="page-title">My Certificates</h1>
          <p className="page-subtitle">Download certificates for events you have attended</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/student/registered")}>
          ← My Registrations
        </button>
      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Certificates</span>
            <span className="stat-value">{pastEvents.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Upcoming Events</span>
            <span className="stat-value" style={{ color:"var(--blue)" }}>
              {events.filter(e => new Date(e.event_date) >= new Date()).length}
            </span>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="content-card">
          <div className="loading-state"><div className="spinner"/><p>Loading certificates...</p></div>
        </div>
      ) : pastEvents.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
            <h3>No certificates yet</h3>
            <p>Attend events to earn certificates</p>
            <button className="btn-primary" style={{ marginTop:8 }} onClick={() => navigate("/events")}>
              Browse Events
            </button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize:"0.88rem", color:"var(--text-muted)", marginBottom:20 }}>
            Certificates are available for <strong>{pastEvents.length}</strong> completed event{pastEvents.length !== 1 ? "s" : ""}. Click Download to save as PDF.
          </p>
          <div className="mycerts-grid">
            {pastEvents.map((event, i) => (
              <CertificateCard
                key={event.event_id}
                event={event}
                studentName={studentName}
                index={i}
              />
            ))}
          </div>
        </>
      )}

      <style>{mycertStyles}</style>
    </div>
  );
}

const mycertStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

.mycerts-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;
}

/* CARD */
.mycert-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 18px; overflow: hidden;
  animation: cardIn 0.4s cubic-bezier(.22,.68,0,1.2) both;
  transition: transform 0.2s, box-shadow 0.2s, background var(--tr), border-color var(--tr);
}
.mycert-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }
@keyframes cardIn {
  from { opacity:0; transform:translateY(16px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}

/* PREVIEW */
.mycert-preview-wrap {
  background: #f0ece3;
  padding: 16px; overflow: hidden; height: 180px;
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1.5px solid var(--border);
}
.mycert-preview-scale {
  transform: scale(0.32); transform-origin: center center;
  width: 900px; height: 636px; flex-shrink: 0;
  pointer-events: none;
}

/* FULL CERT — hidden in DOM, shown scaled */
.mycert-cert-full {
  width: 900px; height: 636px;
  background: #fff; position: relative;
  font-family: 'Crimson Text', Georgia, serif;
}
.mcc-outer { position:absolute; inset:16px; border:3px solid #b8964f; padding:3px; }
.mcc-inner {
  border: 1.5px solid #d4af6a; height:100%;
  padding: 20px 40px; display:flex; flex-direction:column; align-items:center;
  position:relative; overflow:hidden;
}
.mcc-inner::before {
  content:"✦"; position:absolute; font-size:280px; color:rgba(184,150,79,0.04);
  top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
}
.mcc-corner { position:absolute; font-size:1.6rem; color:#b8964f; line-height:1; }
.mcc-tl { top:5px; left:8px; }
.mcc-tr { top:5px; right:8px; transform:scaleX(-1); }
.mcc-bl { bottom:5px; left:8px; transform:scaleY(-1); }
.mcc-br { bottom:5px; right:8px; transform:scale(-1); }
.mcc-topline { display:flex; align-items:center; width:100%; gap:10px; margin-bottom:10px; z-index:1; }
.mcc-gold-line { flex:1; height:1.5px; background:linear-gradient(90deg,transparent,#b8964f,transparent); }
.mcc-medal {
  width:44px; height:44px; border-radius:50%;
  background:linear-gradient(135deg,#b8964f,#d4af6a,#8b6914);
  display:flex; align-items:center; justify-content:center;
}
.mcc-college { font-family:'Playfair Display',Georgia,serif; font-size:11px; font-weight:700; color:#1d3a8a; letter-spacing:0.5px; text-align:center; margin-bottom:6px; z-index:1; text-transform:uppercase; }
.mcc-presents { font-size:10px; color:#6b7280; letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; z-index:1; }
.mcc-main-title { font-family:'Playfair Display',Georgia,serif; font-size:30px; font-weight:800; color:#1a1a2e; margin-bottom:8px; z-index:1; }
.mcc-rule { display:flex; align-items:center; width:70%; gap:8px; margin-bottom:8px; z-index:1; }
.mcc-rl { flex:1; height:1px; background:linear-gradient(90deg,transparent,#b8964f,transparent); }
.mcc-rd { color:#b8964f; font-size:9px; }
.mcc-body-text { font-size:12px; color:#374151; margin-bottom:5px; text-align:center; z-index:1; }
.mcc-name-wrap { display:flex; align-items:center; gap:14px; width:80%; z-index:1; margin:3px 0 6px; }
.mcc-nl { flex:1; height:1px; background:#d4af6a; }
.mcc-student-name { font-family:'Playfair Display',Georgia,serif; font-size:28px; font-weight:700; color:#1d3a8a; white-space:nowrap; }
.mcc-event-name { font-family:'Playfair Display',Georgia,serif; font-size:17px; font-weight:600; color:#b8964f; font-style:italic; margin-bottom:4px; z-index:1; text-align:center; }
.mcc-sigs { display:flex; align-items:center; justify-content:space-between; width:90%; margin-top:8px; z-index:1; gap:10px; }
.mcc-sig { flex:1; text-align:center; }
.mcc-sig-line { height:1px; background:#6b7280; margin-bottom:5px; }
.mcc-sig-title { font-size:9px; color:#6b7280; letter-spacing:0.5px; text-transform:uppercase; }
.mcc-seal { flex-shrink:0; }
.mcc-seal-c {
  width:60px; height:60px; border-radius:50%;
  background:linear-gradient(135deg,#1d3a8a,#2563eb);
  border:2.5px solid #d4af6a;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; color:#fff;
}
.mcc-seal-c span { font-family:'Playfair Display',Georgia,serif; font-size:8px; font-weight:700; letter-spacing:1px; }
.mcc-issue { font-size:8px; color:#9ca3af; margin-top:8px; z-index:1; }

/* CARD INFO */
.mycert-info {
  padding: 18px 20px; display:flex; align-items:flex-start; gap:14px;
}
.mycert-event-badge { font-size:1.5rem; flex-shrink:0; margin-top:2px; }
.mycert-text { flex:1; min-width:0; }
.mycert-event-title {
  font-family:var(--font-display); font-size:0.97rem; font-weight:700;
  color:var(--text-primary); margin-bottom:5px; transition:color var(--tr);
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.mycert-event-date, .mycert-event-loc {
  font-size:0.82rem; color:var(--text-muted); margin-bottom:3px; transition:color var(--tr);
}
.mycert-cat-badge {
  display:inline-block; margin-top:6px;
  background:#dbeafe; color:#1d4ed8; border-radius:20px;
  padding:3px 10px; font-size:0.74rem; font-weight:700;
}
body.dark .mycert-cat-badge { background:#1e3a5f; color:#93c5fd; }

.mycert-download-btn {
  display:flex; align-items:center; gap:6px; flex-shrink:0;
  background:linear-gradient(135deg,#1d3a8a,#2563eb); color:#fff; border:none;
  font-family:var(--font-body); font-size:0.82rem; font-weight:600;
  padding:8px 14px; border-radius:8px; cursor:pointer; white-space:nowrap;
  transition:opacity 0.15s, transform 0.15s;
}
.mycert-download-btn:hover { opacity:0.88; transform:translateY(-1px); }
`;

export default MyCertificates;