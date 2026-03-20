import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken    = () => localStorage.getItem("token");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const formatDate  = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

// ===== EDIT MODAL =====
function EditStudentModal({ student, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name:          student.name          || "",
    email:         student.email         || "",
    enrollment_no: student.enrollment_no || "",
    course:        student.course        || "",
    semester:      student.semester      || "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErr(null);
    try {
      await axios.put(`http://localhost:5000/api/admin/students/${student.student_id}`, form, authHeaders());
      onUpdated(); onClose();
    } catch(er) { setErr(er.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth:480 }} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ padding:"28px" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", fontWeight:700, marginBottom:20, color:"var(--text-primary)" }}>Edit Student</h2>
          {err && <div className="alert alert-error" style={{ marginBottom:14 }}>{err}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { label:"Full Name", key:"name", type:"text" },
              { label:"Email", key:"email", type:"email" },
              { label:"Enrollment No", key:"enrollment_no", type:"text" },
              { label:"Course", key:"course", type:"text" },
              { label:"Semester", key:"semester", type:"number" },
            ].map(f => (
              <div className="field-group" key={f.key} style={{ marginBottom:12 }}>
                <label className="field-label">{f.label}</label>
                <input className="field-input" type={f.type} value={form[f.key]}
                  onChange={e=>setForm({...form,[f.key]:e.target.value})} required/>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>{loading?"Saving...":"Save Changes"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===== REGISTRATIONS MODAL =====
function StudentRegistrationsModal({ student, onClose }) {
  const [regs, setRegs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/admin/students/${student.student_id}/registrations`, authHeaders())
      .then(r => setRegs(r.data))
      .catch(() => setRegs([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const cancelReg = async (reg_id) => {
    if (!window.confirm("Cancel this registration?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/registrations/${reg_id}`, authHeaders());
      setRegs(prev => prev.filter(r => r.registration_id !== reg_id));
    } catch(e) { alert("Failed to cancel"); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth:600 }} onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ padding:"28px" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.2rem", fontWeight:700, marginBottom:6, color:"var(--text-primary)" }}>
            {student.name}'s Registrations
          </h2>
          <p style={{ fontSize:"0.85rem", color:"var(--text-muted)", marginBottom:20 }}>{student.email}</p>

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:32 }}><div className="spinner"/></div>
          ) : regs.length === 0 ? (
            <div className="empty-state"><h3>No registrations</h3></div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {regs.map(r => (
                <div key={r.registration_id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:10, padding:"12px 16px" }}>
                  <div>
                    <div style={{ fontFamily:"var(--font-display)", fontWeight:600, color:"var(--text-primary)", fontSize:"0.92rem" }}>{r.event_title}</div>
                    <div style={{ fontSize:"0.8rem", color:"var(--text-muted)", marginTop:3 }}>{formatDate(r.event_date)} {r.location ? `· ${r.location}` : ""}</div>
                  </div>
                  <button className="btn-danger" style={{ fontSize:"0.8rem", padding:"6px 12px" }} onClick={() => cancelReg(r.registration_id)}>
                    Cancel
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
function AdminManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [editStudent, setEditStudent]     = useState(null);
  const [viewRegs, setViewRegs]           = useState(null);
  const [alert, setAlert]                 = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students", authHeaders());
      setStudents(res.data);
    } catch(e) { setAlert({ type:"error", msg:"Failed to load students" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []); // eslint-disable-line

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This will also cancel all their registrations.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/students/${id}`, authHeaders());
      setStudents(prev => prev.filter(s => s.student_id !== id));
      setAlert({ type:"success", msg:"Student deleted" });
    } catch(e) { setAlert({ type:"error", msg:"Delete failed" }); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollment_no?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 className="page-title">Manage Students</h1>
          <p className="page-subtitle">Edit, delete students and manage their event registrations</p>
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
          <div className="stat-card"><span className="stat-label">Total Students</span><span className="stat-value">{students.length}</span></div>
        </div>
      )}

      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:10, padding:"10px 16px", marginBottom:22 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="Search by name, email, enrollment..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", fontFamily:"var(--font-body)", fontSize:"0.92rem", color:"var(--text-primary)" }}/>
      </div>

      {loading ? (
        <div className="content-card"><div className="loading-state"><div className="spinner"/><p>Loading students...</p></div></div>
      ) : (
        <div className="content-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Student</th><th>Enrollment</th><th>Course</th><th>Sem</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.student_id}>
                    <td style={{ color:"var(--text-muted)", fontWeight:600 }}>{i+1}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg, var(--blue), var(--blue-dark))", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:"0.85rem", flexShrink:0 }}>
                          {s.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="td-name">{s.name}</div>
                          <div className="td-sub">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontFamily:"monospace", fontSize:"0.82rem", background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:6, padding:"2px 8px" }}>{s.enrollment_no}</span></td>
                    <td style={{ color:"var(--text-secondary)" }}>{s.course}</td>
                    <td><span className="badge badge-blue">{s.semester}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <button className="btn-secondary" style={{ padding:"5px 12px", fontSize:"0.8rem" }} onClick={()=>setViewRegs(s)}>
                          📋 Regs
                        </button>
                        <button className="btn-secondary" style={{ padding:"5px 12px", fontSize:"0.8rem" }} onClick={()=>setEditStudent(s)}>
                          ✎ Edit
                        </button>
                        <button className="btn-danger" style={{ padding:"5px 10px", fontSize:"0.8rem" }} onClick={()=>handleDelete(s.student_id, s.name)}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="empty-state"><h3>No students found</h3></div>}
          <div className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> students</div>
        </div>
      )}

      {editStudent && <EditStudentModal student={editStudent} onClose={()=>setEditStudent(null)} onUpdated={fetchStudents}/>}
      {viewRegs    && <StudentRegistrationsModal student={viewRegs} onClose={()=>setViewRegs(null)}/>}
    </div>
  );
}

export default AdminManageStudents;