import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const IMG_BASE    = "http://localhost:5000/uploads/";
const formatDate  = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

const CATEGORIES = ["Workshop","Cultural","Competition","Career","Seminar","Other"];

// ===== EDIT MODAL =====
function EditEventModal({ event, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title:       event.title       || "",
    description: event.description || "",
    category:    event.category    || "Workshop",
    event_date:  event.event_date  ? event.event_date.split("T")[0] : "",
    location:    event.location    || "",
  });
  const [image, setImage]           = useState(null);
  const [preview, setPreview]       = useState(event.image ? `${IMG_BASE}${event.image}` : null);
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErr(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      if (image) fd.append("image", image);
      await axios.put(`http://localhost:5000/api/admin/events/${event.event_id}`, fd, {
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type":"multipart/form-data" }
      });
      onUpdated(); onClose();
    } catch(e) { setErr(e.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth:540 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ padding:"28px" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", fontWeight:700, marginBottom:20, color:"var(--text-primary)" }}>Edit Event</h2>
          {err && <div className="alert alert-error" style={{ marginBottom:14 }}>{err}</div>}
          <form onSubmit={handleSubmit}>
            {/* Image */}
            <div className="field-group" style={{ marginBottom:14 }}>
              <label className="field-label">Banner Image</label>
              {preview ? (
                <div style={{ position:"relative", borderRadius:10, overflow:"hidden", border:"1.5px solid var(--border)" }}>
                  <img src={preview} alt="" style={{ width:"100%", height:140, objectFit:"cover", display:"block" }}/>
                  <label style={{ position:"absolute", bottom:8, right:8, background:"rgba(255,255,255,0.9)", color:"#000", padding:"4px 12px", borderRadius:6, fontSize:"0.8rem", fontWeight:600, cursor:"pointer" }}>
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>✎ Change
                  </label>
                </div>
              ) : (
                <label style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, border:"2px dashed var(--border)", borderRadius:10, padding:"20px", cursor:"pointer", color:"var(--text-muted)", fontSize:"0.88rem" }}>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }}/>
                  📷 Upload Image
                </label>
              )}
            </div>
            <div className="field-group" style={{ marginBottom:12 }}>
              <label className="field-label">Title *</label>
              <input className="field-input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div className="field-group">
                <label className="field-label">Category</label>
                <select className="field-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Date</label>
                <input className="field-input" type="date" value={form.event_date} onChange={e=>setForm({...form,event_date:e.target.value})}/>
              </div>
            </div>
            <div className="field-group" style={{ marginBottom:12 }}>
              <label className="field-label">Location</label>
              <input className="field-input" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Room / Auditorium"/>
            </div>
            <div className="field-group" style={{ marginBottom:20 }}>
              <label className="field-label">Description *</label>
              <textarea className="field-textarea" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required style={{ minHeight:80 }}/>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{loading?"Saving...":"Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
function AdminManageEvents() {
  const navigate = useNavigate();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [editEvent, setEditEvent] = useState(null);
  const [alert, setAlert]       = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/events", authHeaders());
      setEvents(res.data);
    } catch(e) { setAlert({ type:"error", msg:"Failed to load events" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event and all its registrations?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${id}`, authHeaders());
      setEvents(prev => prev.filter(e => e.event_id !== id));
      setAlert({ type:"success", msg:"Event deleted" });
    } catch(e) { setAlert({ type:"error", msg:"Delete failed" }); }
  };

  const filtered = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.creator_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">View, edit and delete all campus events</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {alert.msg}
          <button onClick={() => setAlert(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit", fontSize:"1rem" }}>✕</button>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="stats-row">
          <div className="stat-card"><span className="stat-label">Total Events</span><span className="stat-value">{events.length}</span></div>
          <div className="stat-card"><span className="stat-label">Upcoming</span><span className="stat-value" style={{ color:"var(--blue)" }}>{events.filter(e=>new Date(e.event_date)>=new Date()).length}</span></div>
          <div className="stat-card"><span className="stat-label">Past</span><span className="stat-value" style={{ color:"#16a34a" }}>{events.filter(e=>new Date(e.event_date)<new Date()).length}</span></div>
        </div>
      )}

      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:10, padding:"10px 16px", marginBottom:22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search events..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"0.92rem", color:"var(--text-primary)" }}/>
      </div>

      {loading ? (
        <div className="content-card"><div className="loading-state"><div className="spinner"/><p>Loading events...</p></div></div>
      ) : (
        <div className="content-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Event</th><th>Category</th><th>Date</th><th>Location</th><th>Created By</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.event_id}>
                    <td style={{ color:"var(--text-muted)", fontWeight:600 }}>{i+1}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {e.image ? (
                          <img src={`${IMG_BASE}${e.image}`} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }}
                            onError={ev=>ev.target.style.display="none"}/>
                        ) : (
                          <div style={{ width:36, height:36, borderRadius:8, background:"var(--bg)", border:"1.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:"var(--blue)", fontSize:"1rem" }}>
                            {e.title?.charAt(0)}
                          </div>
                        )}
                        <div className="td-name">{e.title}</div>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{e.category||"—"}</span></td>
                    <td style={{ whiteSpace:"nowrap" }}>{formatDate(e.event_date)}</td>
                    <td style={{ color:"var(--text-secondary)", fontSize:"0.88rem" }}>{e.location||"—"}</td>
                    <td><div className="td-name">{e.creator_name||e.role}</div></td>
                    <td>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="btn-secondary" style={{ padding:"6px 14px", fontSize:"0.82rem" }} onClick={() => setEditEvent(e)}>
                          ✎ Edit
                        </button>
                        <button className="btn-danger" onClick={() => handleDelete(e.event_id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><h3>No events found</h3></div>
          )}
        </div>
      )}

      {editEvent && <EditEventModal event={editEvent} onClose={() => setEditEvent(null)} onUpdated={fetchEvents}/>}
    </div>
  );
}

export default AdminManageEvents;