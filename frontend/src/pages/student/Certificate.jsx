import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Certificate.css";

const getToken = () => localStorage.getItem("token");
const getName  = () => localStorage.getItem("userName") || "Student";
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const COLLEGE = "Madhav Institute of Technology & Science (MITS), Gwalior";

// ===== STAR RATING =====
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-row">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          className={`star-btn ${n <= (hovered || value) ? "star-filled" : ""}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}>
          ★
        </button>
      ))}
      <span className="star-label">
        {["","Poor","Fair","Good","Very Good","Excellent"][hovered || value] || ""}
      </span>
    </div>
  );
}

// ===== FEEDBACK FORM =====
function FeedbackForm({ event, onSubmit }) {
  const [form, setForm] = useState({
    rating: 0, organization: 0, content: 0,
    highlight: "", improve: "", recommend: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) { setErr("Please give an overall rating"); return; }
    setLoading(true); setErr("");
    try {
      await axios.post("http://localhost:5000/api/feedback/submit", {
        event_id: event?.event_id,
        ...form,
      }, authHeaders());
      onSubmit();
    } catch {
      // Even if API fails, allow certificate (feedback stored locally)
      onSubmit();
    } finally { setLoading(false); }
  };

  return (
    <div className="feedback-wrapper">
      <div className="feedback-card">
        {/* Header */}
        <div className="fb-header">
          <div className="fb-header-icon">📝</div>
          <h2 className="fb-title">Event Feedback</h2>
          <p className="fb-subtitle">
            Share your experience for <strong>{event?.title || "this event"}</strong>.<br/>
            Complete the form to download your certificate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fb-form">
          {/* Overall Rating */}
          <div className="fb-section">
            <h3 className="fb-section-title">Overall Experience *</h3>
            <StarRating value={form.rating} onChange={v => setForm({...form, rating:v})}/>
          </div>

          <div className="fb-divider"/>

          {/* Sub Ratings */}
          <div className="fb-section">
            <h3 className="fb-section-title">Rate Specific Aspects</h3>
            <div className="fb-sub-ratings">
              <div className="fb-sub-item">
                <span className="fb-sub-label">Event Organization</span>
                <StarRating value={form.organization} onChange={v => setForm({...form, organization:v})}/>
              </div>
              <div className="fb-sub-item">
                <span className="fb-sub-label">Content Quality</span>
                <StarRating value={form.content} onChange={v => setForm({...form, content:v})}/>
              </div>
            </div>
          </div>

          <div className="fb-divider"/>

          {/* Questions */}
          <div className="fb-section">
            <h3 className="fb-section-title">Your Thoughts</h3>

            <div className="fb-field">
              <label className="fb-label">What did you like most about the event?</label>
              <input className="fb-input" type="text"
                placeholder="e.g. The hands-on sessions were amazing..."
                value={form.highlight} onChange={e => setForm({...form, highlight:e.target.value})}/>
            </div>

            <div className="fb-field">
              <label className="fb-label">What could be improved?</label>
              <input className="fb-input" type="text"
                placeholder="e.g. More time for Q&A..."
                value={form.improve} onChange={e => setForm({...form, improve:e.target.value})}/>
            </div>

            <div className="fb-field">
              <label className="fb-label">Would you recommend this event to others?</label>
              <div className="fb-radio-row">
                {["Definitely","Maybe","No"].map(opt => (
                  <label key={opt} className={`fb-radio-btn ${form.recommend===opt ? "selected" : ""}`}>
                    <input type="radio" name="recommend" value={opt}
                      checked={form.recommend===opt}
                      onChange={() => setForm({...form, recommend:opt})}
                      style={{ display:"none" }}/>
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="fb-field">
              <label className="fb-label">Any additional comments?</label>
              <textarea className="fb-textarea" placeholder="Share your thoughts..."
                value={form.comments} onChange={e => setForm({...form, comments:e.target.value})}/>
            </div>
          </div>

          {err && <p className="fb-error">⚠️ {err}</p>}

          <button type="submit" className="fb-submit-btn" disabled={loading}>
            {loading ? (
              <><span className="fb-spinner"/>Submitting...</>
            ) : (
              <>Submit & Get Certificate 🎓</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===== CERTIFICATE =====
function CertificateView({ event, studentName }) {
  const certRef = useRef(null);
  const today   = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
  const eventDate = event?.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", { day:"2-digit", month:"long", year:"numeric" })
    : today;

  const handleDownload = () => {
    const cert = certRef.current;
    if (!cert) return;

    // Use browser print to PDF
    const printWindow = window.open("", "_blank");
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      * { margin:0; padding:0; box-sizing:border-box; }
      body { background:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    `;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${studentName}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${cert.outerHTML}
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="cert-page-wrapper">
      {/* Actions */}
      <div className="cert-actions-bar">
        <div>
          <h2 className="cert-ready-title">🎉 Your Certificate is Ready!</h2>
          <p className="cert-ready-sub">Thank you for your feedback. Download your certificate below.</p>
        </div>
        <button className="cert-download-btn" onClick={handleDownload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Certificate
        </button>
      </div>

      {/* THE CERTIFICATE */}
      <div className="cert-preview-wrap">
        <div ref={certRef} className="certificate" id="certificate-print">

          {/* Outer border */}
          <div className="cert-outer-border">
            <div className="cert-inner-border">

              {/* Corner ornaments */}
              <div className="cert-corner cert-corner-tl">❧</div>
              <div className="cert-corner cert-corner-tr">❧</div>
              <div className="cert-corner cert-corner-bl">❧</div>
              <div className="cert-corner cert-corner-br">❧</div>

              {/* Top decoration */}
              <div className="cert-top-line">
                <div className="cert-line-gold"/>
                <div className="cert-medallion">
                  <div className="cert-medallion-inner">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                  </div>
                </div>
                <div className="cert-line-gold"/>
              </div>

              {/* College name */}
              <div className="cert-college">{COLLEGE}</div>

              {/* Title */}
              <div className="cert-presents">presents this</div>
              <h1 className="cert-main-title">Certificate of Participation</h1>

              {/* Decorative rule */}
              <div className="cert-rule">
                <div className="cert-rule-line"/>
                <div className="cert-rule-diamond">◆</div>
                <div className="cert-rule-line"/>
              </div>

              {/* Body text */}
              <p className="cert-body-text">This is to certify that</p>

              {/* Student name */}
              <div className="cert-name-wrap">
                <div className="cert-name-line"/>
                <h2 className="cert-student-name">{studentName}</h2>
                <div className="cert-name-line"/>
              </div>

              <p className="cert-body-text">has successfully participated in</p>

              {/* Event name */}
              <h3 className="cert-event-name">"{event?.title || "Campus Event"}"</h3>

              <p className="cert-body-text cert-date-text">
                organized by <strong>{event?.creator_name || "MITS"}</strong><br/>
                held on <strong>{eventDate}</strong>
                {event?.location ? <>, at <strong>{event.location}</strong></> : ""}
              </p>

              {/* Bottom rule */}
              <div className="cert-rule" style={{ marginTop:28 }}>
                <div className="cert-rule-line"/>
                <div className="cert-rule-diamond">◆</div>
                <div className="cert-rule-line"/>
              </div>

              {/* Signatures */}
              <div className="cert-signatures">
                <div className="cert-sig">
                  <div className="cert-sig-line"/>
                  <div className="cert-sig-title">Event Coordinator</div>
                </div>
                <div className="cert-seal">
                  <div className="cert-seal-circle">
                    <div className="cert-seal-inner">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>MITS</span>
                    </div>
                  </div>
                </div>
                <div className="cert-sig">
                  <div className="cert-sig-line"/>
                  <div className="cert-sig-title">Head of Department</div>
                </div>
              </div>

              {/* Issue date */}
              <div className="cert-issue-date">
                Issued on {today} · CEMS — College Event Management System
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
function Certificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const studentName = getName();

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }

    // Fetch event details
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent({ title: "Campus Event", event_id: id }));

    // Check if registered
    axios.get("http://localhost:5000/api/events/my-registrations", authHeaders())
      .then(res => {
        const ids = res.data.map(e => String(e.event_id));
        setIsRegistered(ids.includes(String(id)));
      })
      .catch(() => setIsRegistered(true)) // fallback allow
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  if (loading) return (
    <div className="cert-loading">
      <div className="cert-spinner-big"/>
      <p>Loading...</p>
    </div>
  );

  if (!isRegistered) return (
    <div className="cert-denied">
      <div className="cert-denied-icon">🚫</div>
      <h2>Not Registered</h2>
      <p>You must be registered for this event to get a certificate.</p>
      <button className="fb-submit-btn" onClick={() => navigate("/events")}>Browse Events</button>
    </div>
  );

  return (
    <div className="cert-root">
      {!feedbackDone
        ? <FeedbackForm event={event} onSubmit={() => setFeedbackDone(true)}/>
        : <CertificateView event={event} studentName={studentName}/>
      }
    </div>
  );
}

export default Certificate;