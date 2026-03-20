// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../assets/css/Profile.css";

// const getToken    = () => localStorage.getItem("token");
// const getRole     = () => localStorage.getItem("role");
// const getName     = () => localStorage.getItem("userName") || "";
// const getPic      = () => localStorage.getItem("profilePic") || null;
// const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
// const IMG_BASE    = "http://localhost:5000/uploads/";

// function Profile() {
//   const navigate = useNavigate();
//   const role     = getRole();
//   const fileRef  = useRef(null);

//   const [profile, setProfile]         = useState(null);
//   const [loading, setLoading]         = useState(true);
//   const [editing, setEditing]         = useState(false);
//   const [saving, setSaving]           = useState(false);
//   const [alert, setAlert]             = useState(null);
//   const [newPicFile, setNewPicFile]   = useState(null);
//   const [newPicPreview, setNewPicPreview] = useState(null);
//   const [form, setForm]               = useState({});

//   // ===== FETCH PROFILE =====
//   useEffect(() => {
//     if (!getToken()) { navigate("/login"); return; }

//     const url = role === "student"
//       ? "http://localhost:5000/api/auth/student/profile"
//       : "http://localhost:5000/api/auth/faculty/profile";

//     axios.get(url, authHeaders())
//       .then(res => {
//         setProfile(res.data);
//         setForm(res.data);
//       })
//       .catch(() => {
//         // Fallback to localStorage if API not ready
//         setProfile({
//           name:     getName(),
//           email:    localStorage.getItem("userEmail") || "",
//           profile_pic: getPic()?.replace(IMG_BASE, "") || null,
//           enrollment_no: localStorage.getItem("enrollment_no") || "",
//           course:   localStorage.getItem("course") || "",
//           semester: localStorage.getItem("semester") || "",
//           designation: localStorage.getItem("designation") || "",
//         });
//         setForm({
//           name:     getName(),
//           email:    localStorage.getItem("userEmail") || "",
//           enrollment_no: "",
//           course:   "",
//           semester: "",
//           designation: "",
//         });
//       })
//       .finally(() => setLoading(false));
//   }, []); // eslint-disable-line

//   // ===== IMAGE HANDLER =====
//   const handlePicChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 3 * 1024 * 1024) { setAlert({ type: "error", msg: "Max 3MB allowed" }); return; }
//     setNewPicFile(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setNewPicPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   // ===== SAVE =====
//   const handleSave = async () => {
//     setSaving(true);
//     setAlert(null);
//     try {
//       const fd = new FormData();
//       fd.append("name", form.name);
//       if (role === "student") {
//         fd.append("course",   form.course   || "");
//         fd.append("semester", form.semester || "");
//       }
//       if (role === "faculty") {
//         fd.append("designation", form.designation || "");
//       }
//       if (newPicFile) fd.append("profile_pic", newPicFile);

//       const url = role === "student"
//         ? "http://localhost:5000/api/auth/student/update"
//         : "http://localhost:5000/api/auth/faculty/update";

//       const res = await axios.put(url, fd, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       // Update localStorage
//       localStorage.setItem("userName", form.name);
//       if (newPicPreview) localStorage.setItem("profilePic", newPicPreview);

//       setProfile(prev => ({
//         ...prev,
//         ...form,
//         profile_pic: res.data?.profile_pic || prev.profile_pic,
//       }));
//       setEditing(false);
//       setNewPicFile(null);
//       setNewPicPreview(null);
//       setAlert({ type: "success", msg: "Profile updated successfully ✅" });

//       setTimeout(() => setAlert(null), 3000);
//     } catch (err) {
//       setAlert({ type: "error", msg: err.response?.data?.message || "Update failed" });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cancelEdit = () => {
//     setEditing(false);
//     setForm(profile);
//     setNewPicFile(null);
//     setNewPicPreview(null);
//   };

//   // ===== AVATAR =====
//   const getAvatarSrc = () => {
//     if (newPicPreview) return newPicPreview;
//     if (profile?.profile_pic) {
//       if (profile.profile_pic.startsWith("http") || profile.profile_pic.startsWith("data:"))
//         return profile.profile_pic;
//       return `${IMG_BASE}${profile.profile_pic}`;
//     }
//     return getPic();
//   };

//   const initials = (profile?.name || getName() || "U")
//     .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

//   const avatarSrc = getAvatarSrc();

//   if (loading) return (
//     <div className="profile-page">
//       <div className="profile-loading">
//         <div className="profile-spinner" />
//         <p>Loading profile...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="profile-page">
//       <div className="profile-container">

//         {/* ALERT */}
//         {alert && (
//           <div className={`profile-alert profile-alert-${alert.type}`}>
//             {alert.type === "success" ? "✅" : "⚠️"} {alert.msg}
//           </div>
//         )}

//         {/* ===== HERO CARD ===== */}
//         <div className="profile-hero-card">
//           {/* Background decoration */}
//           <div className="profile-hero-bg">
//             <div className="hero-blob-1" />
//             <div className="hero-blob-2" />
//           </div>

//           {/* Avatar */}
//           <div className="profile-avatar-wrap">
//             <div className="profile-avatar">
//               {avatarSrc ? (
//                 <img src={avatarSrc} alt="profile"
//                   onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
//               ) : null}
//               <div className="profile-avatar-initials" style={{ display: avatarSrc ? "none" : "flex" }}>
//                 {initials}
//               </div>
//             </div>

//             {/* Change pic button */}
//             {editing && (
//               <button className="profile-change-pic-btn" onClick={() => fileRef.current?.click()}>
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                   <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
//                   <circle cx="12" cy="13" r="4"/>
//                 </svg>
//               </button>
//             )}
//             <input ref={fileRef} type="file" accept="image/*" onChange={handlePicChange} style={{ display: "none" }} />
//           </div>

//           {/* Name + Role */}
//           <div className="profile-hero-info">
//             {editing ? (
//               <input
//                 className="profile-name-input"
//                 value={form.name || ""}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//                 placeholder="Your name"
//               />
//             ) : (
//               <h1 className="profile-hero-name">{profile?.name || getName()}</h1>
//             )}
//             <div className="profile-role-badge">
//               <span className={`role-dot role-dot-${role}`} />
//               {role?.charAt(0).toUpperCase() + role?.slice(1)}
//             </div>
//             {role === "faculty" && profile?.designation && !editing && (
//               <p className="profile-designation">{profile.designation}</p>
//             )}
//             {role === "student" && profile?.course && !editing && (
//               <p className="profile-designation">{profile.course} · Sem {profile.semester}</p>
//             )}
//           </div>

//           {/* Edit / Save buttons */}
//           <div className="profile-hero-actions">
//             {!editing ? (
//               <button className="profile-edit-btn" onClick={() => setEditing(true)}>
//                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//                   <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//                 </svg>
//                 Edit Profile
//               </button>
//             ) : (
//               <div style={{ display: "flex", gap: 10 }}>
//                 <button className="profile-cancel-btn" onClick={cancelEdit}>Cancel</button>
//                 <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
//                   {saving ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ===== INFO GRID ===== */}
//         <div className="profile-info-grid">

//           {/* Contact Info */}
//           <div className="profile-info-card">
//             <h3 className="profile-card-title">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
//               </svg>
//               Personal Info
//             </h3>

//             <div className="profile-fields">
//               <ProfileField label="Full Name" value={profile?.name} icon="👤"
//                 editing={editing} editValue={form.name}
//                 onChange={v => setForm({ ...form, name: v })} />

//               <ProfileField label="Email" value={profile?.email} icon="✉️"
//                 editing={false} /> {/* email non-editable */}

//               {role === "student" && (
//                 <ProfileField label="Enrollment No" value={profile?.enrollment_no} icon="🎫"
//                   editing={false} /> // non-editable
//               )}
//             </div>
//           </div>

//           {/* Academic Info */}
//           <div className="profile-info-card">
//             <h3 className="profile-card-title">
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
//               </svg>
//               {role === "student" ? "Academic Info" : "Professional Info"}
//             </h3>

//             <div className="profile-fields">
//               {role === "student" && (<>
//                 <ProfileField label="Course" value={profile?.course} icon="📚"
//                   editing={editing} editValue={form.course}
//                   onChange={v => setForm({ ...form, course: v })} />
//                 <ProfileField label="Semester" value={profile?.semester} icon="📅"
//                   editing={editing} editValue={form.semester}
//                   onChange={v => setForm({ ...form, semester: v })}
//                   type="number" min="1" max="8" />
//               </>)}

//               {role === "faculty" && (
//                 <ProfileField label="Designation" value={profile?.designation} icon="🏷️"
//                   editing={editing} editValue={form.designation}
//                   onChange={v => setForm({ ...form, designation: v })} />
//               )}

//               <div className="profile-field-row">
//                 <span className="pf-icon">🔐</span>
//                 <div className="pf-content">
//                   <span className="pf-label">Role</span>
//                   <span className="pf-value" style={{ textTransform: "capitalize" }}>{role}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* ===== QUICK LINKS ===== */}
//         <div className="profile-quick-links">
//           {role === "student" && (
//             <button className="quick-link-btn" onClick={() => navigate("/student/registered")}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
//               </svg>
//               My Registrations
//             </button>
//           )}
//           {role === "faculty" && (<>
//             <button className="quick-link-btn" onClick={() => navigate("/faculty/my-events")}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
//               </svg>
//               My Events
//             </button>
//             <button className="quick-link-btn" onClick={() => navigate("/faculty/create-event")}>
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
//               </svg>
//               Create Event
//             </button>
//           </>)}
//           <button className="quick-link-btn quick-link-danger"
//             onClick={() => {
//               localStorage.clear();
//               navigate("/login");
//               window.location.reload();
//             }}>
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//               <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
//             </svg>
//             Logout
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ===== REUSABLE FIELD =====
// function ProfileField({ label, value, icon, editing, editValue, onChange, type = "text", min, max }) {
//   return (
//     <div className="profile-field-row">
//       <span className="pf-icon">{icon}</span>
//       <div className="pf-content">
//         <span className="pf-label">{label}</span>
//         {editing && onChange ? (
//           <input
//             className="pf-input"
//             type={type}
//             value={editValue || ""}
//             onChange={e => onChange(e.target.value)}
//             min={min} max={max}
//           />
//         ) : (
//           <span className="pf-value">{value || "—"}</span>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Profile;



import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Profile.css";

const getToken    = () => localStorage.getItem("token");
const getRole     = () => localStorage.getItem("role");
const getName     = () => localStorage.getItem("userName") || "";
const getPic      = () => localStorage.getItem("profilePic") || null;
const authHeaders = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });
const IMG_BASE    = "http://localhost:5000/uploads/";

function Profile() {
  const navigate = useNavigate();
  const role     = getRole();
  const fileRef  = useRef(null);

  const [profile, setProfile]             = useState(null);
  const [loading, setLoading]             = useState(true);
  const [editing, setEditing]             = useState(false);
  const [saving, setSaving]               = useState(false);
  const [alert, setAlert]                 = useState(null);
  const [newPicFile, setNewPicFile]       = useState(null);
  const [newPicPreview, setNewPicPreview] = useState(null);
  const [form, setForm]                   = useState({});

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }

    if (role === "admin") {
      // Admin — sirf localStorage se data dikhao
      setProfile({
        name:  getName(),
        email: localStorage.getItem("userEmail") || "admin@cems.com",
        role:  "admin",
      });
      setLoading(false);
      return;
    }

    const url = role === "student"
      ? "http://localhost:5000/api/auth/student/profile"
      : "http://localhost:5000/api/auth/faculty/profile";

    axios.get(url, authHeaders())
      .then(res => { setProfile(res.data); setForm(res.data); })
      .catch(() => {
        setProfile({ name: getName(), email: "", profile_pic: null });
        setForm({ name: getName(), email: "" });
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setAlert({ type:"error", msg:"Max 3MB" }); return; }
    setNewPicFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setNewPicPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (role === "student") {
        fd.append("course",   form.course   || "");
        fd.append("semester", form.semester || "");
      }
      if (role === "faculty") fd.append("designation", form.designation || "");
      if (newPicFile) fd.append("profile_pic", newPicFile);

      const url = role === "student"
        ? "http://localhost:5000/api/auth/student/update"
        : "http://localhost:5000/api/auth/faculty/update";

      const res = await axios.put(url, fd, {
        headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("userName", form.name);
      if (newPicPreview) localStorage.setItem("profilePic", newPicPreview);

      setProfile(prev => ({ ...prev, ...form, profile_pic: res.data?.profile_pic || prev.profile_pic }));
      setEditing(false); setNewPicFile(null); setNewPicPreview(null);
      setAlert({ type:"success", msg:"Profile updated ✅" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setAlert({ type:"error", msg: err.response?.data?.message || "Update failed" });
    } finally { setSaving(false); }
  };

  const getAvatarSrc = () => {
    if (newPicPreview) return newPicPreview;
    if (profile?.profile_pic) {
      if (profile.profile_pic.startsWith("http") || profile.profile_pic.startsWith("data:"))
        return profile.profile_pic;
      return `${IMG_BASE}${profile.profile_pic}`;
    }
    return getPic();
  };

  const initials  = (profile?.name || getName() || "?").split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
  const avatarSrc = getAvatarSrc();
  const isAdmin   = role === "admin";

  if (loading) return (
    <div className="profile-page">
      <div className="profile-loading"><div className="profile-spinner"/><p>Loading...</p></div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">

        {alert && (
          <div className={`profile-alert profile-alert-${alert.type}`}>
            {alert.type === "success" ? "✅" : "⚠️"} {alert.msg}
          </div>
        )}

        {/* HERO CARD */}
        <div className="profile-hero-card">
          <div className="profile-hero-bg">
            <div className="hero-blob-1"/><div className="hero-blob-2"/>
          </div>

          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {avatarSrc ? (
                <img src={avatarSrc} alt="profile"
                  onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}/>
              ) : null}
              <div className="profile-avatar-initials" style={{ display: avatarSrc ? "none" : "flex" }}>
                {initials}
              </div>
            </div>
            {editing && !isAdmin && (
              <button className="profile-change-pic-btn" onClick={() => fileRef.current?.click()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePicChange} style={{ display:"none" }}/>
          </div>

          <div className="profile-hero-info">
            {editing && !isAdmin ? (
              <input className="profile-name-input" value={form.name||""} placeholder="Your name"
                onChange={e => setForm({...form, name:e.target.value})}/>
            ) : (
              <h1 className="profile-hero-name">{profile?.name || getName()}</h1>
            )}

            <div className="profile-role-badge">
              <span className={`role-dot role-dot-${role}`}/>
              {role?.charAt(0).toUpperCase() + role?.slice(1)}
            </div>

            {role === "faculty" && profile?.designation && !editing && (
              <p className="profile-designation">{profile.designation}</p>
            )}
            {role === "student" && profile?.course && !editing && (
              <p className="profile-designation">{profile.course} · Sem {profile.semester}</p>
            )}
            {isAdmin && (
              <p className="profile-designation">System Administrator</p>
            )}
          </div>

          {/* Edit button — admin ke liye nahi */}
          {!isAdmin && (
            <div className="profile-hero-actions">
              {!editing ? (
                <button className="profile-edit-btn" onClick={() => setEditing(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div style={{ display:"flex", gap:10 }}>
                  <button className="profile-cancel-btn" onClick={() => { setEditing(false); setForm(profile); setNewPicFile(null); setNewPicPreview(null); }}>
                    Cancel
                  </button>
                  <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* INFO GRID */}
        <div className="profile-info-grid">
          <div className="profile-info-card">
            <h3 className="profile-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Personal Info
            </h3>
            <div className="profile-fields">
              <ProfileField label="Full Name" value={profile?.name} icon="👤"
                editing={editing && !isAdmin} editValue={form.name}
                onChange={v => setForm({...form, name:v})}/>
              <ProfileField label="Email" value={profile?.email || "admin@cems.com"} icon="✉️" editing={false}/>
              {role === "student" && (
                <ProfileField label="Enrollment No" value={profile?.enrollment_no} icon="🎫" editing={false}/>
              )}
            </div>
          </div>

          <div className="profile-info-card">
            <h3 className="profile-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              {role === "student" ? "Academic Info" : "Professional Info"}
            </h3>
            <div className="profile-fields">
              {role === "student" && (<>
                <ProfileField label="Course" value={profile?.course} icon="📚"
                  editing={editing} editValue={form.course}
                  onChange={v => setForm({...form, course:v})}/>
                <ProfileField label="Semester" value={profile?.semester} icon="📅"
                  editing={editing} editValue={form.semester}
                  onChange={v => setForm({...form, semester:v})} type="number" min="1" max="8"/>
              </>)}
              {role === "faculty" && (
                <ProfileField label="Designation" value={profile?.designation} icon="🏷️"
                  editing={editing} editValue={form.designation}
                  onChange={v => setForm({...form, designation:v})}/>
              )}
              <ProfileField label="Role" value={role?.charAt(0).toUpperCase()+role?.slice(1)} icon="🔐" editing={false}/>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="profile-quick-links">
          {role === "student" && (<>
            <button className="quick-link-btn" onClick={() => navigate("/student/registered")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              My Registrations
            </button>
            <button className="btn-secondary" onClick={() => navigate("/student/certificates")}>
   My Certificates
</button>
          </>
          
          )}
          {role === "faculty" && (<>
            <button className="quick-link-btn" onClick={() => navigate("/faculty/my-events")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              My Events
            </button>
            <button className="quick-link-btn" onClick={() => navigate("/faculty/create-event")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              Create Event
            </button>
          </>)}
          {role === "admin" && (<>
            <button className="quick-link-btn" onClick={() => navigate("/admin/manage-events")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              Manage Events
            </button>
            <button className="quick-link-btn" onClick={() => navigate("/admin/manage-students")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              Manage Students
            </button>
            <button className="quick-link-btn" onClick={() => navigate("/admin/manage-faculty")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Manage Faculty
            </button>
            <button className="quick-link-btn" onClick={() => navigate("/admin/registrations")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              All Registrations
            </button>
          </>)}
          <button className="quick-link-btn quick-link-danger"
            onClick={() => { localStorage.clear(); navigate("/login"); window.location.reload(); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

function ProfileField({ label, value, icon, editing, editValue, onChange, type="text", min, max }) {
  return (
    <div className="profile-field-row">
      <span className="pf-icon">{icon}</span>
      <div className="pf-content">
        <span className="pf-label">{label}</span>
        {editing && onChange ? (
          <input className="pf-input" type={type} value={editValue||""} min={min} max={max}
            onChange={e => onChange(e.target.value)}/>
        ) : (
          <span className="pf-value">{value || "—"}</span>
        )}
      </div>
    </div>
  );
}

export default Profile;