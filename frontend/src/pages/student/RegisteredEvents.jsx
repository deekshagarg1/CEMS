import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import "./pages.css";
import "../../assets/css/pages.css";

const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric"
}) : "TBD";

const formatDateTime = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
}) : "";

const CATEGORY_COLORS = {
  Workshop:    { bg: "#dbeafe", color: "#1d4ed8" },
  Cultural:    { bg: "#fce7f3", color: "#9d174d" },
  Competition: { bg: "#dcfce7", color: "#15803d" },
  Career:      { bg: "#ffedd5", color: "#c2410c" },
  Seminar:     { bg: "#f3e8ff", color: "#7e22ce" },
  Other:       { bg: "#f1f5f9", color: "#475569" },
};

function RegisteredEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid"); // grid | table

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    axios.get("http://localhost:5000/api/events/my-registrations", authHeaders())
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date());
  const past = events.filter((e) => new Date(e.event_date) < new Date());

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div className="page-title-block" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Registered Events</h1>
          <p className="page-subtitle">All events you have signed up for</p>
        </div>
        {/* View toggle */}
        <div className="view-toggle">
          <button className={`vt-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Grid
          </button>
          <button className={`vt-btn ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            List
          </button>
        </div>
      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Registered</span>
            <span className="stat-value">{events.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value" style={{ color: "var(--blue)" }}>{upcoming.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <span className="stat-value" style={{ color: "#16a34a" }}>{past.length}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="content-card"><div className="loading-state"><div className="spinner" /><p>Loading your events...</p></div></div>
      ) : events.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>
            </svg>
            <h3>No registrations yet</h3>
            <p>Browse events and register to see them here</p>
            <button className="btn-primary" style={{ marginTop: 8 }} onClick={() => navigate("/events")}>
              Browse Events
            </button>
          </div>
        </div>
      ) : view === "grid" ? (
        <>
          {upcoming.length > 0 && (
            <div className="reg-section">
              <div className="reg-section-header">
                <span className="reg-section-title">Upcoming</span>
                <span className="badge badge-blue">{upcoming.length}</span>
              </div>
              <div className="reg-grid">
                {upcoming.map((e, i) => <RegCard key={e.event_id} event={e} index={i} navigate={navigate} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div className="reg-section" style={{ marginTop: 36 }}>
              <div className="reg-section-header">
                <span className="reg-section-title">Past Events</span>
                <span className="badge badge-gray">{past.length}</span>
              </div>
              <div className="reg-grid">
                {past.map((e, i) => <RegCard key={e.event_id} event={e} index={i} navigate={navigate} past />)}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="content-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Registered On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e, i) => {
                  const isPast = new Date(e.event_date) < new Date();
                  return (
                    <tr key={e.event_id} style={{ cursor: "pointer" }} onClick={() => navigate(`/events/${e.event_id}`)}>
                      <td style={{ color: "var(--text-muted)", fontWeight: 600 }}>{i + 1}</td>
                      <td>
                        <div className="td-name">{e.title}</div>
                        <div className="td-sub">{e.creator_name || ""}</div>
                      </td>
                      <td>
                        {e.category && (
                          <span style={{
                            background: (CATEGORY_COLORS[e.category] || CATEGORY_COLORS.Other).bg,
                            color: (CATEGORY_COLORS[e.category] || CATEGORY_COLORS.Other).color,
                            padding: "3px 10px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700
                          }}>{e.category}</span>
                        )}
                      </td>
                      <td>{formatDate(e.event_date)}</td>
                      <td>{e.location || "—"}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{formatDateTime(e.registered_at)}</td>
                      <td>
                        <span className={`badge ${isPast ? "badge-gray" : "badge-green"}`}>
                          {isPast ? "Completed" : "Upcoming"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{regStyles}</style>
    </div>
  );
}

function RegCard({ event, index, navigate, past }) {
  const catStyle = (CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other);
  return (
    <div
      className={`reg-card ${past ? "reg-card-past" : ""}`}
      style={{ animationDelay: `${index * 0.06}s`, cursor: "pointer" }}
      onClick={() => navigate(`/events/${event.event_id}`)}
    >


      <div className="reg-card-top">
        <div className="reg-card-initial" style={{ background: past ? "var(--border)" : "linear-gradient(135deg, var(--blue), var(--blue-dark))" }}>
          {event.title?.charAt(0)}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {event.category && (
            <span style={{ background: catStyle.bg, color: catStyle.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700 }}>
              {event.category}
            </span>
          )}
          {past && <span className="badge badge-gray">Completed</span>}
          {!past && <span className="badge badge-green">Upcoming</span>}
        </div>
      </div>
      <h3 className="reg-card-title">{event.title}</h3>
      <div className="reg-card-meta">
        <span>📅 {new Date(event.event_date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</span>
        {event.location && <span>📍 {event.location}</span>}
      </div>
{/* ----------------------------- */}
 <button
        style={{
          marginTop: 12, width:"100%", padding:"8px",
          background:"linear-gradient(135deg, #1d3a8a, #2563eb)",
          color:"#fff", border:"none", borderRadius:8,
          fontFamily:"var(--font-body)", fontSize:"0.85rem",
          fontWeight:600, cursor:"pointer"
        }}
        onClick={(e) => {
          e.stopPropagation(); // card click se alag
          navigate(`/certificate/${event.event_id}`);
        }}
      >
        🎓 Get Certificate
      </button>
{/* --------------------- */}
    </div>
  );
}

const regStyles = `
.view-toggle {
  display: flex; background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 9px; padding: 3px; gap: 2px;
  transition: background var(--tr), border-color var(--tr);
}
.vt-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border: none; border-radius: 7px;
  font-family: var(--font-body); font-size: 0.85rem; font-weight: 600;
  cursor: pointer; color: var(--text-secondary); background: transparent;
  transition: all var(--tr);
}
.vt-btn.active { background: var(--black-btn); color: #fff; }
.reg-section-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
}
.reg-section-title {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); transition: color var(--tr);
}
.reg-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;
}
.reg-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 14px; padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s, background var(--tr), border-color var(--tr);
  animation: cardIn 0.4s cubic-bezier(.22,.68,0,1.2) both;
}
.reg-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
.reg-card-past { opacity: 0.72; }
.reg-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.reg-card-initial {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: #fff;
}
.reg-card-title {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 10px; line-height: 1.3;
  transition: color var(--tr);
}
.reg-card-meta {
  display: flex; flex-direction: column; gap: 5px;
  font-size: 0.83rem; color: var(--text-secondary); transition: color var(--tr);
}
`;

export default RegisteredEvents;