// import { useState, useEffect } from "react";
// import axios from "axios";
// import "../assets/css/Events.css";

// // ===== HELPERS =====
// const getToken = () => localStorage.getItem("token");
// const getRole = () => localStorage.getItem("role");

// const authHeaders = () => ({
//   headers: { Authorization: `Bearer ${getToken()}` },
// });

// const formatDate = (dateStr) => {
//   if (!dateStr) return "TBD";
//   return new Date(dateStr).toLocaleDateString("en-IN", {
//     day: "2-digit", month: "short", year: "numeric",
//   });
// };

// const CATEGORIES = ["All", "Workshop", "Cultural", "Competition", "Career", "Seminar", "Other"];

// // ===== EVENT CARD =====
// function EventCard({ event, role, onViewDetails, onDelete, registeredIds }) {
//   const isRegistered = registeredIds?.includes(event.event_id);

//   return (
//     <div className="event-card" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
//       <div className="event-card-img">
//   {event.image ? (
//     <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
//   ) : (
//     <div className="event-img-placeholder">
//       <span>{event.title?.charAt(0)}</span>
//     </div>
//   )}
//   {event.category && (
//     <span className="event-category-badge">{event.category}</span>
//   )}
//   {event.role && (
//     <span className="event-creator-badge">{event.creator_name || event.role}</span>
//   )}
// </div>
//       <div className="event-card-body">
//         <h3 className="event-title">{event.title}</h3>
//         <p className="event-desc">
//           {event.description?.length > 100
//             ? event.description.slice(0, 100) + "..."
//             : event.description}
//         </p>

//         <div className="event-meta">
//           <span className="meta-item">
//             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
//             </svg>
//             {formatDate(event.event_date)}
//           </span>
//           {event.location && (
//             <span className="meta-item">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
//                 <circle cx="12" cy="9" r="2.5"/>
//               </svg>
//               {event.location}
//             </span>
//           )}
//         </div>

//         <div className="event-card-actions">
//           <button className="btn-view-details" onClick={() => onViewDetails(event)}>
//             View Details
//           </button>
//           {role === "faculty" && (
//             <button className="btn-delete-event" onClick={() => onDelete(event.event_id)}>
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
//               </svg>
//               Delete
//             </button>
//           )}
//           {role === "student" && (
//             <span className={`reg-status ${isRegistered ? "registered" : ""}`}>
//               {isRegistered ? "✓ Registered" : ""}
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== EVENT DETAIL MODAL =====
// function EventModal({ event, role, onClose, onRegister, registeredIds }) {
//   if (!event) return null;
//   const isRegistered = registeredIds?.includes(event.event_id);

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-card" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>✕</button>

//         <div className="modal-img">
//           {event.image ? (
//             <img src={`http://localhost:5000/uploads/${event.image}`} alt={event.title} />
//           ) : (
//             <div className="modal-img-placeholder">
//               <span>{event.title?.charAt(0)}</span>
//             </div>
//           )}
//         </div>

//         <div className="modal-body">
//           <div className="modal-tags">
//             {event.category && <span className="event-category-badge">{event.category}</span>}
//             {event.role && <span className="event-creator-badge">{event.creator_name || event.role}</span>}
//           </div>

//           <h2 className="modal-title">{event.title}</h2>
//           <p className="modal-desc">{event.description}</p>

//           <div className="modal-meta">
//             <div className="modal-meta-item">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
//               </svg>
//               <div>
//                 <span className="meta-label">Date</span>
//                 <span className="meta-value">{formatDate(event.event_date)}</span>
//               </div>
//             </div>
//             {event.location && (
//               <div className="modal-meta-item">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
//                   <circle cx="12" cy="9" r="2.5"/>
//                 </svg>
//                 <div>
//                   <span className="meta-label">Location</span>
//                   <span className="meta-value">{event.location}</span>
//                 </div>
//               </div>
//             )}
//             <div className="modal-meta-item">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
//                 <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
//               </svg>
//               <div>
//                 <span className="meta-label">Organized by</span>
//                 <span className="meta-value">{event.creator_name || event.role}</span>
//               </div>
//             </div>
//           </div>

//           {role === "student" && (
//             <button
//               className={`btn-register-event ${isRegistered ? "registered" : ""}`}
//               onClick={() => !isRegistered && onRegister(event.event_id)}
//               disabled={isRegistered}
//             >
//               {isRegistered ? "✓ Already Registered" : "Register for this Event"}
//             </button>
//           )}
//           {!role && (
//             <p className="login-to-register">
//               <a href="/login">Login</a> to register for this event
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===== CREATE EVENT MODAL =====
// function CreateEventModal({ onClose, onCreated }) {
//   const [form, setForm] = useState({
//     title: "", description: "", event_date: "", location: "", category: "Workshop",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:5000/api/events/create", form, authHeaders());
//       alert("Event created ✅");
//       onCreated();
//       onClose();
//     } catch (err) {
//       alert("Failed: " + (err.response?.data?.message || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-card create-modal" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>✕</button>
//         <h2 className="modal-title">Create New Event</h2>

//         <form onSubmit={handleSubmit} className="create-form">
//           <div className="field-group">
//             <label className="field-label">Event Title</label>
//             <input className="field-input" type="text" placeholder="e.g. AI Workshop"
//               value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
//           </div>

//           <div className="field-group">
//             <label className="field-label">Category</label>
//             <select className="field-input" value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}>
//               {CATEGORIES.filter(c => c !== "All").map(c => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//           </div>

//           <div className="field-group">
//             <label className="field-label">Description</label>
//             <textarea className="field-input field-textarea" placeholder="Event description..."
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })} required />
//           </div>

//           <div className="form-row">
//             <div className="field-group">
//               <label className="field-label">Date</label>
//               <input className="field-input" type="date"
//                 value={form.event_date}
//                 onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
//             </div>
//             <div className="field-group">
//               <label className="field-label">Location</label>
//               <input className="field-input" type="text" placeholder="Room 301 / Auditorium"
//                 value={form.location}
//                 onChange={(e) => setForm({ ...form, location: e.target.value })} />
//             </div>
//           </div>

//           <button type="submit" className="btn-submit" disabled={loading}>
//             {loading ? "Creating..." : "Create Event"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ===== MAIN EVENTS PAGE =====
// function Events() {
//   const [events, setEvents] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [registeredIds, setRegisteredIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const role = getRole();

//   // Fetch events
//   const fetchEvents = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/events/");
//       setEvents(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error("Fetch events error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch registered events for student
//   const fetchRegistrations = async () => {
//     if (role !== "student") return;
//     try {
//       const res = await axios.get("http://localhost:5000/api/events/my-registrations", authHeaders());
//       setRegisteredIds(res.data.map((e) => e.event_id));
//     } catch (err) {
//       console.error("Fetch registrations error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//     fetchRegistrations();
//   }, []);

//   // Search + filter
//   useEffect(() => {
//     let result = events;
//     if (activeCategory !== "All") {
//       result = result.filter((e) => e.category === activeCategory);
//     }
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       result = result.filter(
//         (e) =>
//           e.title?.toLowerCase().includes(q) ||
//           e.description?.toLowerCase().includes(q) ||
//           e.location?.toLowerCase().includes(q)
//       );
//     }
//     setFiltered(result);
//   }, [search, activeCategory, events]);

//   // Student register
//   const handleRegister = async (event_id) => {
//     if (!getToken()) { alert("Please login first"); return; }
//     try {
//       await axios.post("http://localhost:5000/api/events/register", { event_id }, authHeaders());
//       alert("Registered successfully ✅");
//       setRegisteredIds((prev) => [...prev, event_id]);
//       setSelectedEvent(null);
//     } catch (err) {
//       alert(err.response?.data?.message || "Registration failed");
//     }
//   };

//   // Faculty delete
//   const handleDelete = async (event_id) => {
//     if (!window.confirm("Delete this event?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/events/delete/${event_id}`, authHeaders());
//       alert("Event deleted ✅");
//       fetchEvents();
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="events-page">
//       {/* HEADER */}
//       <div className="events-header">
//         <div>
//           <h1 className="events-heading">Upcoming Events</h1>
//           <p className="events-subheading">Discover and register for campus events</p>
//         </div>
//         {role === "faculty" && (
//           <button className="btn-create-event" onClick={() => setShowCreate(true)}>
//             + Create Event
//           </button>
//         )}
//       </div>

//       {/* SEARCH + FILTER */}
//       <div className="events-controls">
//         <div className="search-box">
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
//           </svg>
//           <input
//             type="text"
//             placeholder="Search events..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           {search && (
//             <button className="search-clear" onClick={() => setSearch("")}>✕</button>
//           )}
//         </div>

//         <div className="filter-tabs">
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
//           </svg>
//           {CATEGORIES.map((cat) => (
//             <button
//               key={cat}
//               className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
//               onClick={() => setActiveCategory(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* EVENTS GRID */}
//       {loading ? (
//         <div className="events-loading">
//           <div className="spinner" />
//           <p>Loading events...</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="events-empty">
//           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//             <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
//           </svg>
//           <p>No events found</p>
//           <span>Try a different search or filter</span>
//         </div>
//       ) : (
//         <div className="events-grid">
//           {filtered.map((event) => (
//             <EventCard
//               key={event.event_id}
//               event={event}
//               role={role}
//               onViewDetails={setSelectedEvent}
//               onDelete={handleDelete}
//               registeredIds={registeredIds}
//             />
//           ))}
//         </div>
//       )}

//       {/* MODALS */}
//       {selectedEvent && (
//         <EventModal
//           event={selectedEvent}
//           role={role}
//           onClose={() => setSelectedEvent(null)}
//           onRegister={handleRegister}
//           registeredIds={registeredIds}
//         />
//       )}
//       {showCreate && (
//         <CreateEventModal
//           onClose={() => setShowCreate(false)}
//           onCreated={fetchEvents}
//         />
//       )}
//     </div>
//   );
// }

// export default Events;












import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/Events.css";

const getToken = () => localStorage.getItem("token");
const getRole  = () => localStorage.getItem("role");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const getImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http")) return img;
  return `http://localhost:5000/uploads/${img}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const CATEGORIES = ["All", "Workshop", "Cultural", "Competition", "Career", "Seminar", "Other"];

function EventCard({ event, role, onViewDetails, onDelete, registeredIds }) {
  const isRegistered = registeredIds?.includes(event.event_id);
  const imgUrl = getImageUrl(event.image);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="event-card">
      <div className="event-card-img" onClick={() => onViewDetails(event)}>
        {imgUrl && !imgErr ? (
          <img src={imgUrl} alt={event.title} onError={() => setImgErr(true)} />
        ) : (
          <div className="event-img-placeholder">
            <span>{event.title?.charAt(0)?.toUpperCase()}</span>
          </div>
        )}
        {event.category && <span className="event-category-badge">{event.category}</span>}
        {event.role && <span className="event-creator-badge">{event.creator_name || event.role}</span>}
      </div>

      <div className="event-card-body">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc">
          {event.description?.length > 100 ? event.description.slice(0, 100) + "..." : event.description}
        </p>
        <div className="event-meta">
          <span className="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {formatDate(event.event_date)}
          </span>
          {event.location && (
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {event.location}
            </span>
          )}
        </div>
        <div className="event-card-actions">
          <button className="btn-view-details" onClick={() => onViewDetails(event)}>View Details</button>
          {role === "faculty" && (
            <button className="btn-delete-event" onClick={(e) => { e.stopPropagation(); onDelete(event.event_id); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
              Delete
            </button>
          )}
          {role === "student" && isRegistered && <span className="reg-status registered">✓ Registered</span>}
        </div>
      </div>
    </div>
  );
}

function EventModal({ event, role, onClose, onRegister, registeredIds }) {
const [imgErr, setImgErr] = useState(false);
  if (!event) return null;
  const isRegistered = registeredIds?.includes(event.event_id);
  const imgUrl = getImageUrl(event.image);


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img">
          {imgUrl && !imgErr ? (
            <img src={imgUrl} alt={event.title} onError={() => setImgErr(true)} />
          ) : (
            <div className="modal-img-placeholder">
              <span>{event.title?.charAt(0)?.toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="modal-body">
          <div className="modal-tags">
            {event.category && <span className="event-category-badge">{event.category}</span>}
            {event.role && <span className="event-creator-badge">{event.creator_name || event.role}</span>}
          </div>
          <h2 className="modal-title">{event.title}</h2>
          <p className="modal-desc">{event.description}</p>
          <div className="modal-meta">
            <div className="modal-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <div><span className="meta-label">Date</span><span className="meta-value">{formatDate(event.event_date)}</span></div>
            </div>
            {event.location && (
              <div className="modal-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <div><span className="meta-label">Location</span><span className="meta-value">{event.location}</span></div>
              </div>
            )}
            <div className="modal-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <div><span className="meta-label">Organized by</span><span className="meta-value">{event.creator_name || event.role}</span></div>
            </div>
          </div>
          {role === "student" && (
            <button className={`btn-register-event ${isRegistered ? "registered" : ""}`}
              onClick={() => !isRegistered && onRegister(event.event_id)} disabled={isRegistered}>
              {isRegistered ? "✓ Already Registered" : "Register for this Event"}
            </button>
          )}
          {!role && <p className="login-to-register"><a href="/login">Login</a> to register</p>}
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title:"", description:"", event_date:"", location:"", category:"Workshop" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Only images allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    setImage(file);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      await axios.post("http://localhost:5000/api/events/create", fd,
        { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } });
      alert("Event created ✅");
      onCreated(); onClose();
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card create-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title" style={{ padding:"24px 28px 0" }}>Create New Event</h2>
        <form onSubmit={handleSubmit} className="create-form" style={{ padding:"16px 28px 28px" }}>

          <div className="field-group">
            <label className="field-label">Event Banner</label>
            {!preview ? (
              <label className="upload-drop-zone">
                <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>Click to upload banner</span>
                <small>PNG, JPG, WEBP · Max 5MB</small>
              </label>
            ) : (
              <div className="upload-preview-box">
                <img src={preview} alt="preview" />
                <div className="upload-preview-actions">
                  <label className="upload-change-btn">
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                    ✎ Change
                  </label>
                  <button type="button" className="upload-remove-btn"
                    onClick={() => { setImage(null); setPreview(null); }}>✕ Remove</button>
                </div>
              </div>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Event Title *</label>
            <input className="field-input" type="text" placeholder="e.g. AI Workshop"
              value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} required />
          </div>
          <div className="field-group">
            <label className="field-label">Category</label>
            <select className="field-input" value={form.category} onChange={(e) => setForm({...form, category:e.target.value})}>
              {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Description *</label>
            <textarea className="field-input field-textarea" placeholder="Event description..."
              value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} required />
          </div>
          <div className="form-row">
            <div className="field-group">
              <label className="field-label">Date *</label>
              <input className="field-input" type="date" value={form.event_date}
                onChange={(e) => setForm({...form, event_date:e.target.value})} required />
            </div>
            <div className="field-group">
              <label className="field-label">Location</label>
              <input className="field-input" type="text" placeholder="Room / Auditorium"
                value={form.location} onChange={(e) => setForm({...form, location:e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getRole();

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events/");
      setEvents(res.data); setFiltered(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchRegistrations = async () => {
    if (role !== "student" || !getToken()) return;
    try {
      const res = await axios.get("http://localhost:5000/api/events/my-registrations", authHeaders());
      setRegisteredIds(res.data.map((e) => e.event_id));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchEvents(); fetchRegistrations(); }, []); // eslint-disable-line

  useEffect(() => {
    let result = events;
    if (activeCategory !== "All") result = result.filter((e) => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) =>
        e.title?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, activeCategory, events]);

  const handleRegister = async (event_id) => {
    if (!getToken()) { alert("Please login first"); return; }
    try {
      await axios.post("http://localhost:5000/api/events/register", { event_id }, authHeaders());
      alert("Registered ✅");
      setRegisteredIds((prev) => [...prev, event_id]);
      setSelectedEvent(null);
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const handleDelete = async (event_id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${event_id}`, authHeaders());
      fetchEvents();
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  return (
    <div className="events-page">
      <div className="events-header">
        <div>
          <h1 className="events-heading">Upcoming Events</h1>
          <p className="events-subheading">Discover and register for campus events</p>
        </div>
        {role === "faculty" && (
          <button className="btn-create-event" onClick={() => setShowCreate(true)}>+ Create Event</button>
        )}
      </div>

      <div className="events-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search events..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <div className="filter-tabs">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="events-loading"><div className="spinner" /><p>Loading events...</p></div>
      ) : filtered.length === 0 ? (
        <div className="events-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <p>No events found</p><span>Try a different search or filter</span>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((event) => (
            <EventCard key={event.event_id} event={event} role={role}
              onViewDetails={setSelectedEvent} onDelete={handleDelete} registeredIds={registeredIds} />
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventModal event={selectedEvent} role={role} onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister} registeredIds={registeredIds} />
      )}
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onCreated={fetchEvents} />}
    </div>
  );
}

export default Events;