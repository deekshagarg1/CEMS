import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/pages.css";

const getToken = () => localStorage.getItem("token");
const getRole  = () => localStorage.getItem("role");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  weekday: "long", day: "2-digit", month: "long", year: "numeric"
}) : "TBD";

const CATEGORY_COLORS = {
  Workshop:    { bg: "#dbeafe", color: "#1d4ed8" },
  Cultural:    { bg: "#fce7f3", color: "#9d174d" },
  Competition: { bg: "#dcfce7", color: "#15803d" },
  Career:      { bg: "#ffedd5", color: "#c2410c" },
  Seminar:     { bg: "#f3e8ff", color: "#7e22ce" },
  Other:       { bg: "#f1f5f9", color: "#475569" },
};

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const role = getRole();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch {
        setAlert({ type: "error", msg: "Event not found" });
      } finally {
        setLoading(false);
      }
    };

    const checkRegistration = async () => {
      if (role !== "student" || !getToken()) return;
      try {
        const res = await axios.get("http://localhost:5000/api/events/my-registrations", authHeaders());
        const ids = res.data.map((e) => e.event_id);
        setRegistered(ids.includes(Number(id)));
      } catch {}
    };

    fetchEvent();
    checkRegistration();
  }, [id,role]);

  const handleRegister = async () => {
    if (!getToken()) { navigate("/login"); return; }
    setRegLoading(true);
    try {
      await axios.post("http://localhost:5000/api/events/register", { event_id: id }, authHeaders());
      setRegistered(true);
      setAlert({ type: "success", msg: "Successfully registered for this event! ✅" });
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Registration failed" });
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-state"><div className="spinner" /><p>Loading event...</p></div>
    </div>
  );

  if (!event) return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate("/events")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Events
      </button>
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <h3>Event not found</h3>
      </div>
    </div>
  );

  const catStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;

  return (
    <div className="page-wrapper">
      {/* BACK */}
      <button className="back-btn" onClick={() => navigate("/events")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back to Events
      </button>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
      )}

      <div className="event-detail-layout">
        {/* LEFT — MAIN CONTENT */}
        <div className="event-detail-main">
          {/* Hero image */}
          <div className="detail-hero content-card">
            {event.image ? (
              <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} className="detail-hero-img" />
            ) : (
              <div className="detail-hero-placeholder">
                <span>{event.title?.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="content-card detail-content-card">
            <div className="detail-content-body">
              {/* Tags */}
              <div className="detail-tags">
                {event.category && (
                  <span className="detail-cat-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                    {event.category}
                  </span>
                )}
                {event.role && (
                  <span className="badge badge-gray">{event.creator_name || event.role}</span>
                )}
              </div>

              <h1 className="detail-title">{event.title}</h1>

              <div className="detail-divider" />

              <h3 className="detail-section-heading">About this Event</h3>
              <p className="detail-description">{event.description}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — SIDEBAR */}
        <div className="event-detail-sidebar">
          <div className="content-card sidebar-card">
            <div className="sidebar-body">
              <h3 className="sidebar-heading">Event Details</h3>

              <div className="sidebar-meta-list">
                <div className="sidebar-meta-item">
                  <div className="sidebar-meta-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                  </div>
                  <div>
                    <span className="sidebar-meta-label">Date</span>
                    <span className="sidebar-meta-value">{formatDate(event.event_date)}</span>
                  </div>
                </div>

                {event.location && (
                  <div className="sidebar-meta-item">
                    <div className="sidebar-meta-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                      </svg>
                    </div>
                    <div>
                      <span className="sidebar-meta-label">Location</span>
                      <span className="sidebar-meta-value">{event.location}</span>
                    </div>
                  </div>
                )}

                <div className="sidebar-meta-item">
                  <div className="sidebar-meta-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    <span className="sidebar-meta-label">Organized by</span>
                    <span className="sidebar-meta-value">{event.creator_name || event.role}</span>
                  </div>
                </div>

                {event.category && (
                  <div className="sidebar-meta-item">
                    <div className="sidebar-meta-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </div>
                    <div>
                      <span className="sidebar-meta-label">Category</span>
                      <span className="sidebar-meta-value">{event.category}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTON */}
              {role === "student" && (
                <button
                  className={`sidebar-register-btn ${registered ? "registered" : ""}`}
                  onClick={handleRegister}
                  disabled={registered || regLoading}
                >
                  {regLoading ? (
                    <><div className="btn-spinner" /> Registering...</>
                  ) : registered ? (
                    <>✓ Already Registered</>
                  ) : (
                    <>Register for Event</>
                  )}
                </button>
              )}

              {!role && (
                <button className="sidebar-register-btn" onClick={() => navigate("/login")}>
                  Login to Register
                </button>
              )}

              {role === "faculty" && (
                <div className="faculty-actions">
                  <button className="btn-secondary" style={{width:"100%"}} onClick={() => navigate(`/faculty/edit-event/${id}`)}>
                    Edit Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{detailStyles}</style>
    </div>
  );
}

const detailStyles = `
.event-detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}
.event-detail-main { display: flex; flex-direction: column; gap: 20px; }
.detail-hero { overflow: hidden; }
.detail-hero-img { width: 100%; height: 360px; object-fit: cover; display: block; }
.detail-hero-placeholder {
  height: 360px; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #2563eb18, #2563eb36);
}
.detail-hero-placeholder span {
  font-family: var(--font-display); font-size: 8rem; font-weight: 800;
  color: var(--blue); opacity: 0.25;
}
.detail-content-body { padding: 32px 36px; }
.detail-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.detail-cat-badge {
  display: inline-flex; align-items: center;
  padding: 5px 14px; border-radius: 20px;
  font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2px;
}
.detail-title {
  font-family: var(--font-display); font-size: 1.9rem; font-weight: 800;
  color: var(--text-primary); letter-spacing: -0.6px; line-height: 1.25;
  margin-bottom: 24px; transition: color var(--tr);
}
.detail-divider { height: 1.5px; background: var(--border); margin-bottom: 24px; }
.detail-section-heading {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 12px; transition: color var(--tr);
}
.detail-description {
  font-size: 0.95rem; color: var(--text-secondary); line-height: 1.8;
  white-space: pre-line; transition: color var(--tr);
}
.sidebar-card { position: sticky; top: 80px; }
.sidebar-body { padding: 28px; }
.sidebar-heading {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 22px; transition: color var(--tr);
}
.sidebar-meta-list { display: flex; flex-direction: column; gap: 18px; margin-bottom: 24px; }
.sidebar-meta-item { display: flex; align-items: flex-start; gap: 12px; }
.sidebar-meta-icon {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--bg); border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--blue);
  transition: background var(--tr), border-color var(--tr);
}
.sidebar-meta-label {
  display: block; font-size: 0.72rem; font-weight: 700;
  color: var(--text-muted); text-transform: uppercase;
  letter-spacing: 0.5px; margin-bottom: 3px;
}
.sidebar-meta-value {
  display: block; font-size: 0.9rem; font-weight: 500;
  color: var(--text-primary); line-height: 1.4; transition: color var(--tr);
}
.sidebar-register-btn {
  width: 100%; padding: 13px;
  background: var(--blue); color: #fff;
  border: none; border-radius: 11px;
  font-family: var(--font-display); font-size: 0.95rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background var(--tr), opacity 0.15s, transform 0.15s;
}
.sidebar-register-btn:hover:not(:disabled) { background: var(--blue-dark); transform: translateY(-1px); }
.sidebar-register-btn.registered { background: #16a34a; cursor: default; }
.sidebar-register-btn:disabled { opacity: 0.85; }
.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff; border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@media (max-width: 900px) {
  .event-detail-layout { grid-template-columns: 1fr; }
  .sidebar-card { position: static; }
  .detail-hero-img, .detail-hero-placeholder { height: 240px; }
}
`;

export default EventDetail;