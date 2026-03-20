import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken = () => localStorage.getItem("token");
const getRole  = () => localStorage.getItem("role");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "2-digit", month: "short", year: "numeric"
}) : "—";
const formatDateTime = (d) => d ? new Date(d).toLocaleString("en-IN", {
  day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
}) : "—";

function Registrations() {
  const navigate = useNavigate();
  const role = getRole();

  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("All");
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    // if (!getToken() || role !== "admin") { navigate("/login"); return; }
      if (!getToken()) { navigate("/login"); return; }

    axios.get("http://localhost:5000/api/events/all-registrations", authHeaders())
      .then((res) => {
        setRegistrations(res.data);
        setFiltered(res.data);
        // Unique event titles for filter
        const events = [...new Set(res.data.map((r) => r.event_title))].filter(Boolean);
        setEventList(events);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Search + filter
  useEffect(() => {
    let result = registrations;
    if (filterEvent !== "All") result = result.filter((r) => r.event_title === filterEvent);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.student_name?.toLowerCase().includes(q) ||
          r.student_email?.toLowerCase().includes(q) ||
          r.enrollment_no?.toLowerCase().includes(q) ||
          r.event_title?.toLowerCase().includes(q) ||
          r.course?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterEvent, registrations]);

  // Stats
  const uniqueStudents = new Set(registrations.map((r) => r.student_id)).size;
  const uniqueEvents   = new Set(registrations.map((r) => r.event_id)).size;

  if (role !== "admin") return (
    <div className="page-wrapper">
      <div className="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <h3>Access Denied</h3>
        <p>Only admins can view this page.</p>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-title-block">
        <h1 className="page-title">Event Registrations</h1>
        <p className="page-subtitle">All student registrations across every event</p>
      </div>

      {/* STATS */}
      {!loading && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total Registrations</span>
            <span className="stat-value">{registrations.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Unique Students</span>
            <span className="stat-value" style={{ color: "var(--blue)" }}>{uniqueStudents}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Events with Registrations</span>
            <span className="stat-value" style={{ color: "#16a34a" }}>{uniqueEvents}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Showing</span>
            <span className="stat-value" style={{ color: "#c2410c" }}>{filtered.length}</span>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="reg-controls">
        {/* Search */}
        <div className="search-box-admin">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, enrollment, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch("")}>✕</button>}
        </div>

        {/* Event filter */}
        <div style={{ position: "relative", minWidth: 220 }}>
          <select
            className="field-select"
            value={filterEvent}
            onChange={(e) => setFilterEvent(e.target.value)}
            style={{ paddingRight: 36 }}
          >
            <option value="All">All Events</option>
            {eventList.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-muted)" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        {/* Export hint */}
        <button className="btn-secondary" style={{ whiteSpace:"nowrap" }}
          onClick={() => {
            const csv = [
              ["#","Student","Email","Enrollment","Course","Semester","Event","Date","Location","Registered On"],
              ...filtered.map((r,i) => [
                i+1, r.student_name, r.student_email, r.enrollment_no,
                r.course, r.semester, r.event_title,
                formatDate(r.event_date), r.location || "", formatDateTime(r.registered_at)
              ])
            ].map(row => row.join(",")).join("\n");
            const blob = new Blob([csv], { type:"text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "registrations.csv";
            a.click();
          }}>
          ↓ Export CSV
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="content-card"><div className="loading-state"><div className="spinner" /><p>Loading registrations...</p></div></div>
      ) : filtered.length === 0 ? (
        <div className="content-card">
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h3>No registrations found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        </div>
      ) : (
        <div className="content-card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Enrollment</th>
                  <th>Course</th>
                  <th>Sem</th>
                  <th>Event</th>
                  <th>Event Date</th>
                  <th>Location</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.registration_id} style={{ animationDelay: `${i * 0.03}s` }}>
                    <td style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: "0.85rem" }}>{i + 1}</td>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">{r.student_name?.charAt(0)}</div>
                        <div>
                          <div className="td-name">{r.student_name}</div>
                          <div className="td-sub">{r.student_email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="enrollment-chip">{r.enrollment_no}</span>
                    </td>
                    <td>{r.course}</td>
                    <td style={{ textAlign: "center" }}>
                      <span className="badge badge-blue">{r.semester}</span>
                    </td>
                    <td>
                      <div className="td-name">{r.event_title}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(r.event_date)}</td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>{r.location || "—"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {formatDateTime(r.registered_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Showing <strong>{filtered.length}</strong> of <strong>{registrations.length}</strong> registrations
          </div>
        </div>
      )}

      <style>{adminStyles}</style>
    </div>
  );
}

const adminStyles = `
.reg-controls {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 22px; flex-wrap: wrap;
}
.search-box-admin {
  flex: 1; min-width: 240px;
  display: flex; align-items: center; gap: 10px;
  background: var(--surface); border: 1.5px solid var(--border);
  border-radius: 10px; padding: 10px 16px;
  transition: border-color var(--tr), background var(--tr);
}
.search-box-admin:focus-within { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
.search-box-admin svg { color: var(--text-muted); flex-shrink: 0; }
.search-box-admin input {
  flex: 1; border: none; outline: none; background: transparent;
  font-family: var(--font-body); font-size: 0.92rem; color: var(--text-primary);
}
.search-box-admin input::placeholder { color: var(--text-muted); }
.clear-btn { background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:0.85rem; }
.student-cell { display: flex; align-items: center; gap: 10px; }
.student-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 0.85rem; font-weight: 700;
  color: #fff; flex-shrink: 0;
}
.enrollment-chip {
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 6px; padding: 3px 8px;
  font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
  font-family: monospace; transition: background var(--tr), border-color var(--tr);
}
.table-footer {
  padding: 14px 20px;
  border-top: 1.5px solid var(--border);
  font-size: 0.85rem; color: var(--text-muted);
  transition: border-color var(--tr), color var(--tr);
}
`;

export default Registrations;