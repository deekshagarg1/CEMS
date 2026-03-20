import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken = () => localStorage.getItem("token");
const getRole  = () => localStorage.getItem("role");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric"
}) : "TBD";

const CATEGORY_COLORS = {
  Workshop:    { bg: "#dbeafe", color: "#1d4ed8" },
  Cultural:    { bg: "#fce7f3", color: "#9d174d" },
  Competition: { bg: "#dcfce7", color: "#15803d" },
  Career:      { bg: "#ffedd5", color: "#c2410c" },
  Seminar:     { bg: "#f3e8ff", color: "#7e22ce" },
  Other:       { bg: "#f1f5f9", color: "#475569" },
};

// ===== EDIT MODAL =====
function EditModal({ event, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title:       event.title       || "",
    description: event.description || "",
    category:    event.category    || "Workshop",
    event_date:  event.event_date  ? event.event_date.split("T")[0] : "",
    location:    event.location    || "",
  });
  const [newImage, setNewImage]       = useState(null);
  const [imagePreview, setImagePreview] = useState(
    event.image ? `http://localhost:5000/uploads/${event.image}` : null
  );
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]     = useState(null);

  const CATEGORIES = ["Workshop", "Cultural", "Competition", "Career", "Seminar", "Other"];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setAlert({ type:"error", msg:"Max 5MB" }); return; }
    setNewImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (newImage) formData.append("image", newImage);

      await axios.put(
        `http://localhost:5000/api/events/update/${event.event_id}`,
        formData,
        { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } }
      );
      setAlert({ type: "success", msg: "Event updated ✅" });
      setTimeout(() => { onUpdated(); onClose(); }, 1000);
    } catch (err) {
      setAlert({ type: "error", msg: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ padding: "32px 28px" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.3rem", fontWeight:700, marginBottom:22, color:"var(--text-primary)" }}>
            Edit Event
          </h2>

          {alert && <div className={`alert alert-${alert.type}`} style={{ marginBottom:16 }}>{alert.msg}</div>}

          <form onSubmit={handleSubmit}>
            {/* Image */}
            <div style={{ marginBottom:16 }}>
              <label className="field-label">Banner Image</label>
              {imagePreview ? (
                <div className="edit-img-preview">
                  <img src={imagePreview} alt="preview" />
                  <label className="edit-img-change-btn">
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                    ✎ Change Image
                  </label>
                </div>
              ) : (
                <label className="edit-img-upload">
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Click to upload image
                </label>
              )}
            </div>

            {/* Title */}
            <div style={{ marginBottom:14 }}>
              <label className="field-label">Title *</label>
              <input className="field-input" name="title" value={form.title} onChange={handleChange} required />
            </div>

            {/* Category + Date */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
              <div>
                <label className="field-label">Category</label>
                <div style={{ position:"relative" }}>
                  <select className="field-select" name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-muted)" }}
                    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>
              <div>
                <label className="field-label">Date</label>
                <input className="field-input" type="date" name="event_date" value={form.event_date} onChange={handleChange} />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom:14 }}>
              <label className="field-label">Location</label>
              <input className="field-input" name="location" placeholder="Room / Auditorium" value={form.location} onChange={handleChange} />
            </div>

            {/* Description */}
            <div style={{ marginBottom:20 }}>
              <label className="field-label">Description *</label>
              <textarea className="field-textarea" name="description" value={form.description} onChange={handleChange} required style={{ minHeight:90 }} />
            </div>

            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{modalStyles}</style>
    </div>
  );
}

// ===== EVENT CARD =====
function MyEventCard({ event, onEdit, onDelete, index }) {
  const catStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
  const isPast   = new Date(event.event_date) < new Date();
  const navigate = useNavigate();

  return (
    <div className="my-event-card" style={{ animationDelay: `${index * 0.07}s` }}>
      {/* Image */}
      <div className="my-event-img" onClick={() => navigate(`/events/${event.event_id}`)}>
        {event.image ? (
          <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
        ) : (
          <div className="my-event-img-placeholder">
            <span>{event.title?.charAt(0)}</span>
          </div>
        )}
        <span className="my-event-status-badge" style={{ background: isPast ? "#6b728022" : "#16a34a22", color: isPast ? "#6b7280" : "#16a34a" }}>
          {isPast ? "Completed" : "● Live"}
        </span>
      </div>

      {/* Body */}
      <div className="my-event-body">
        <div className="my-event-tags">
          {event.category && (
            <span style={{ background: catStyle.bg, color: catStyle.color, padding:"3px 10px", borderRadius:20, fontSize:"0.75rem", fontWeight:700 }}>
              {event.category}
            </span>
          )}
        </div>

        <h3 className="my-event-title" onClick={() => navigate(`/events/${event.event_id}`)}>
          {event.title}
        </h3>

        <p className="my-event-desc">
          {event.description?.length > 90 ? event.description.slice(0, 90) + "..." : event.description}
        </p>

        <div className="my-event-meta">
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {formatDate(event.event_date)}
          </span>
          {event.location && (
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
              </svg>
              {event.location}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="my-event-actions">
          <button className="btn-edit" onClick={() => onEdit(event)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(event.event_id)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
function MyEvents() {
  const navigate  = useNavigate();
  const role      = getRole();
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [alert, setAlert]         = useState(null);
  const [search, setSearch]       = useState("");

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events/my-events", authHeaders());
      setEvents(res.data);
    } catch (err) {
      setAlert({ type:"error", msg: err.response?.data?.message || "Failed to load events" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken() || role !== "faculty") { navigate("/login"); return; }
    fetchMyEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (event_id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${event_id}`, authHeaders());
      setAlert({ type:"success", msg:"Event deleted successfully" });
      setEvents(prev => prev.filter(e => e.event_id !== event_id));
    } catch (err) {
      setAlert({ type:"error", msg: err.response?.data?.message || "Delete failed" });
    }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.location?.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = filtered.filter(e => new Date(e.event_date) >= new Date());
  const past     = filtered.filter(e => new Date(e.event_date) <  new Date());

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="myev-header">
        <div>
          <h1 className="page-title">My Events</h1>
          <p className="page-subtitle">Manage all events you have created</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/faculty/create-event")}>
          + Create Event
        </button>
      </div>

      {/* ALERT */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.msg}
          <button onClick={() => setAlert(null)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"inherit", fontSize:"1rem" }}>✕</button>
        </div>
      )}

      {/* STATS */}
      {!loading && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Events</span>
            <span className="stat-value">{events.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value" style={{ color:"var(--blue)" }}>
              {events.filter(e => new Date(e.event_date) >= new Date()).length}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <span className="stat-value" style={{ color:"#16a34a" }}>
              {events.filter(e => new Date(e.event_date) < new Date()).length}
            </span>
          </div>
        </div>
      )}

      {/* SEARCH */}
      {!loading && events.length > 0 && (
        <div className="myev-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search your events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-muted)" }}>✕</button>}
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="content-card">
          <div className="loading-state"><div className="spinner" /><p>Loading your events...</p></div>
        </div>
      ) : events.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              <path d="M8 14h8M8 18h5"/>
            </svg>
            <h3>No events yet</h3>
            <p>Create your first event to get started</p>
            <button className="btn-primary" style={{ marginTop:8 }} onClick={() => navigate("/faculty/create-event")}>
              + Create Event
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="myev-section">
              <div className="myev-section-header">
                <span className="myev-section-title">Upcoming</span>
                <span className="badge badge-blue">{upcoming.length}</span>
              </div>
              <div className="myev-grid">
                {upcoming.map((e, i) => (
                  <MyEventCard key={e.event_id} event={e} index={i} onEdit={setEditEvent} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="myev-section" style={{ marginTop:36 }}>
              <div className="myev-section-header">
                <span className="myev-section-title">Past Events</span>
                <span className="badge badge-gray">{past.length}</span>
              </div>
              <div className="myev-grid">
                {past.map((e, i) => (
                  <MyEventCard key={e.event_id} event={e} index={i} onEdit={setEditEvent} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* EDIT MODAL */}
      {editEvent && (
        <EditModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdated={fetchMyEvents}
        />
      )}

      <style>{myEventsStyles}</style>
    </div>
  );
}

const myEventsStyles = `
.myev-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
}
.myev-search {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 10px; padding: 10px 16px;
  margin-bottom: 24px;
  transition: border-color var(--tr), background var(--tr);
}
.myev-search:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.myev-search svg { color: var(--text-muted); flex-shrink: 0; }
.myev-search input {
  flex: 1; border: none; outline: none; background: transparent;
  font-family: var(--font-body); font-size: 0.92rem; color: var(--text-primary);
}
.myev-search input::placeholder { color: var(--text-muted); }
.myev-section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.myev-section-title {
  font-family: var(--font-display); font-size: 1rem; font-weight: 700;
  color: var(--text-primary); transition: color var(--tr);
}
.myev-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px;
}
.my-event-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 16px; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, background var(--tr), border-color var(--tr);
  animation: cardIn 0.4s cubic-bezier(.22,.68,0,1.2) both;
}
.my-event-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.09); }
.my-event-img {
  height: 180px; overflow: hidden; position: relative; cursor: pointer;
  background: var(--bg);
}
.my-event-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.4s; }
.my-event-card:hover .my-event-img img { transform: scale(1.04); }
.my-event-img-placeholder {
  width:100%; height:100%; display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, #2563eb18, #2563eb36);
}
.my-event-img-placeholder span {
  font-family: var(--font-display); font-size: 4rem; font-weight: 800;
  color: var(--blue); opacity: 0.3;
}
.my-event-status-badge {
  position: absolute; bottom: 10px; right: 10px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 700;
  backdrop-filter: blur(6px);
}
.my-event-body { padding: 18px 20px; }
.my-event-tags { margin-bottom: 10px; }
.my-event-title {
  font-family: var(--font-display); font-size: 1.02rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 8px; line-height: 1.3;
  cursor: pointer; transition: color var(--tr);
}
.my-event-title:hover { color: var(--blue); }
.my-event-desc { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.55; margin-bottom: 12px; }
.my-event-meta {
  display: flex; flex-direction: column; gap: 5px;
  font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;
}
.my-event-meta span { display: flex; align-items: center; gap: 6px; }
.my-event-actions { display: flex; gap: 8px; }
.btn-edit {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  background: var(--bg); border: 1.5px solid var(--border);
  color: var(--text-primary); font-family: var(--font-body);
  font-size: 0.87rem; font-weight: 600;
  padding: 9px; border-radius: 9px; cursor: pointer;
  transition: all var(--tr);
}
.btn-edit:hover { border-color: var(--blue); color: var(--blue); background: var(--surface); }
`;

const modalStyles = `
.modal-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn 0.2s ease;
}
.modal-card {
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 20px; width: 100%; max-height: 90vh; overflow-y: auto;
  position: relative; animation: modalIn 0.3s cubic-bezier(.22,.68,0,1.2);
  transition: background var(--tr), border-color var(--tr);
}
.modal-close {
  position: absolute; top: 14px; right: 14px;
  background: var(--surface-hover); border: 1.5px solid var(--border);
  color: var(--text-secondary); width: 30px; height: 30px;
  border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; z-index: 10; transition: all var(--tr);
}
.modal-close:hover { background: var(--border); color: var(--text-primary); }
.edit-img-preview {
  position: relative; border-radius: 10px; overflow: hidden;
  border: 1.5px solid var(--border); margin-bottom: 4px;
}
.edit-img-preview img { width: 100%; height: 160px; object-fit: cover; display: block; }
.edit-img-change-btn {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(255,255,255,0.92); color: #0f0f0f;
  padding: 6px 14px; border-radius: 8px; font-size: 0.82rem;
  font-weight: 600; cursor: pointer; font-family: var(--font-body);
}
.edit-img-upload {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  border: 2px dashed var(--border); border-radius: 10px; padding: 24px;
  cursor: pointer; color: var(--text-muted); font-size: 0.88rem; font-weight: 500;
  transition: border-color var(--tr), background var(--tr);
}
.edit-img-upload:hover { border-color: var(--blue); color: var(--blue); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalIn { from { opacity: 0; transform: scale(0.94) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
`;

export default MyEvents;