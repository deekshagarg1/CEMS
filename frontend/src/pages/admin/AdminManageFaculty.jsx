import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const formatDate  = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

// ===== FACULTY EVENTS MODAL =====
function FacultyEventsModal({ faculty, onClose, onRefresh }) {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/faculty/${faculty.faculty_id}/events`, authHeaders())
      .then(r => setEvents(r.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const deleteEvent = async (event_id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/events/${event_id}`, authHeaders());
      setEvents(prev => prev.filter(e => e.event_id !== event_id));
    } catch(e) { alert("Delete failed"); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth:600 }} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ padding:"28px" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", fontWeight:700, marginBottom:6, color:"var(--text-primary)" }}>
            {faculty.name}'s Events
          </h2>
          <p style={{ fontSize:"0.85rem", color:"var(--text-muted)", marginBottom:20 }}>{faculty.designation}</p>

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:32 }}><div className="spinner"/></div>
          ) : events.length === 0 ? (
            <div className="empty-state"><h3>No events created</h3></div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {events.map(e => (
                <div key={e.event_id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:10, padding:"12px 16px" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"var(--text-primary)", fontSize:"0.92rem" }}>{e.title}</div>
                    <div style={{ fontSize:"0.8rem", color:"var(--text-muted)", marginTop:3 }}>
                      {e.category} · {formatDate(e.event_date)} {e.location ? `· ${e.location}` : ""}
                    </div>
                  </div>
                  <button className="btn-danger" style={{ fontSize:"0.8rem", padding:"6px 12px" }} onClick={()=>deleteEvent(e.event_id)}>
                    🗑 Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
function AdminManageFaculty() {
  const navigate = useNavigate();
  const [faculty, setFaculty]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [viewEvents, setViewEvents]       = useState(null);
  const [alert, setAlert]                 = useState(null);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/faculty", authHeaders());
      setFaculty(res.data);
    } catch(e) { setAlert({ type:"error", msg:"Failed to load faculty" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaculty(); }, []); // eslint-disable-line

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete faculty "${name}"? This will also delete all their events.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/faculty/${id}`, authHeaders());
      setFaculty(prev => prev.filter(f => f.faculty_id !== id));
      setAlert({ type:"success", msg:"Faculty deleted" });
    } catch(e) { setAlert({ type:"error", msg:"Delete failed" }); }
  };

  const toggleStatus = async (f) => {
    const newStatus = f.status === "active" ? "inactive" : "active";
    if (!window.confirm(`${newStatus === "inactive" ? "Deactivate" : "Activate"} ${f.name}?`)) return;
    try {
      await axios.patch(`http://localhost:5000/api/admin/faculty/${f.faculty_id}/status`,
        { status: newStatus }, authHeaders());
      setFaculty(prev => prev.map(fac => fac.faculty_id === f.faculty_id ? {...fac, status:newStatus} : fac));
      setAlert({ type:"success", msg:`Faculty ${newStatus}` });
    } catch(e) { setAlert({ type:"error", msg:"Status update failed" }); }
  };

  const filtered = faculty.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 className="page-title">Manage Faculty</h1>
          <p className="page-subtitle">Activate, deactivate, delete faculty and manage their events</p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          {alert.msg}
          <button onClick={()=>setAlert(null)} style={{ background:"none", border:"none", cursor:"pointer", color:"inherit" }}>✕</button>
        </div>
      )}

      {!loading && (
        <div className="stats-row">
          <div className="stat-card"><span className="stat-label">Total Faculty</span><span className="stat-value">{faculty.length}</span></div>
          <div className="stat-card"><span className="stat-label">Active</span><span className="stat-value" style={{ color:"#16a34a" }}>{faculty.filter(f=>f.status!=="inactive").length}</span></div>
          <div className="stat-card"><span className="stat-label">Inactive</span><span className="stat-value" style={{ color:"#dc2626" }}>{faculty.filter(f=>f.status==="inactive").length}</span></div>
        </div>
      )}

      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:10, padding:"10px 16px", marginBottom:22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search by name, email, designation..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"0.92rem", color:"var(--text-primary)" }}/>
      </div>

      {loading ? (
        <div className="content-card"><div className="loading-state"><div className="spinner"/><p>Loading faculty...</p></div></div>
      ) : (
        <div className="content-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Faculty</th><th>Designation</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((f, i) => (
                  <tr key={f.faculty_id} style={{ opacity: f.status==="inactive" ? 0.65 : 1 }}>
                    <td style={{ color:"var(--text-muted)", fontWeight:600 }}>{i+1}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg, #16a34a, #15803d)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.85rem", flexShrink:0 }}>
                          {f.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="td-name">{f.name}</div>
                          <div className="td-sub">{f.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color:"var(--text-secondary)" }}>{f.designation || "—"}</td>
                    <td>
                      <span className={`badge ${f.status==="inactive" ? "badge-orange" : "badge-green"}`}>
                        {f.status==="inactive" ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <button className="btn-secondary" style={{ padding:"5px 12px", fontSize:"0.8rem" }} onClick={()=>setViewEvents(f)}>
                          📋 Events
                        </button>
                        <button
                          style={{ padding:"5px 12px", fontSize:"0.8rem", border:"none", borderRadius:8, cursor:"pointer", fontWeight:600, fontFamily:"var(--font-body)",
                            background: f.status==="inactive" ? "#dcfce7" : "#ffedd5",
                            color: f.status==="inactive" ? "#15803d" : "#c2410c"
                          }}
                          onClick={()=>toggleStatus(f)}
                        >
                          {f.status==="inactive" ? "✓ Activate" : "⊘ Deactivate"}
                        </button>
                        <button className="btn-danger" style={{ padding:"5px 10px", fontSize:"0.8rem" }} onClick={()=>handleDelete(f.faculty_id, f.name)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="empty-state"><h3>No faculty found</h3></div>}
          <div className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{faculty.length}</strong> faculty</div>
        </div>
      )}

      {viewEvents && <FacultyEventsModal faculty={viewEvents} onClose={()=>setViewEvents(null)} onRefresh={fetchFaculty}/>}
    </div>
  );
}

export default AdminManageFaculty;