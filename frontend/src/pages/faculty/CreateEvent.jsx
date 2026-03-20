import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/css/pages.css";

const getToken = () => localStorage.getItem("token");
const getRole  = () => localStorage.getItem("role");
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "multipart/form-data",
  },
});

const CATEGORIES = ["Workshop", "Cultural", "Competition", "Career", "Seminar", "Other"];

function CreateEvent() {
  const navigate = useNavigate();
  const role = getRole();

  const [form, setForm] = useState({
    title: "", description: "", category: "Workshop",
    event_date: "", location: "",
  });
  const [image, setImage] = useState([null]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  if (role !== "faculty") {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h3>Access Denied</h3>
          <p>Only faculty can create events.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAlert({ type: "error", msg: "Only image files are allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: "error", msg: "Image must be smaller than 5MB" });
      return;
    }
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setAlert(null);
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      const formData = new FormData();
      formData.append("title",       form.title);
      formData.append("description", form.description);
      formData.append("category",    form.category);
      formData.append("event_date",  form.event_date);
      formData.append("location",    form.location);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/events/create", formData, authHeaders());
      setAlert({ type: "success", msg: "Event published successfully! ✅" });
      setTimeout(() => navigate("/faculty/my-events"), 1500);
    } catch (err) {
      setAlert({
        type: "error",
        msg: err.response?.data?.message || err.response?.data?.detail || "Failed to create event",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <button className="back-btn" onClick={() => navigate("/faculty/my-events")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to My Events
      </button>

      <div className="page-title-block">
        <h1 className="page-title">Create New Event</h1>
        <p className="page-subtitle">Fill in the details to publish a new campus event</p>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="content-card">
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-grid">

            {/* ===== IMAGE UPLOAD ===== */}
            <div className="field-group form-full">
              <label className="field-label">Event Banner Image</label>

              {!imagePreview ? (
                <label className="image-upload-area">
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                  <div className="image-upload-content">
                    <div className="image-upload-icon">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                    <p className="image-upload-title">Click to upload event banner</p>
                    <p className="image-upload-hint">PNG, JPG, WEBP · Max 5MB</p>
                  </div>
                </label>
              ) : (
                <div className="image-preview-box">
                  <img src={imagePreview} alt="preview" className="image-preview-img" />
                  <div className="image-preview-overlay">
                    <label className="image-change-btn">
                      <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                      ✎ Change
                    </label>
                    <button type="button" className="image-remove-btn" onClick={removeImage}>
                      ✕ Remove
                    </button>
                  </div>
                  <div className="image-preview-name">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                    </svg>
                    {image?.name} &nbsp;·&nbsp; {(image?.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="field-group form-full">
              <label className="field-label">Event Title *</label>
              <input className="field-input" type="text" name="title"
                placeholder="e.g. AI & Machine Learning Workshop"
                value={form.title} onChange={handleChange} required />
            </div>

            {/* Category + Date */}
            <div className="field-group">
              <label className="field-label">Category *</label>
              <div style={{ position:"relative" }}>
                <select className="field-select" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"var(--text-muted)" }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Event Date *</label>
              <input className="field-input" type="date" name="event_date"
                value={form.event_date} onChange={handleChange} required />
            </div>

            {/* Location */}
            <div className="field-group form-full">
              <label className="field-label">Location</label>
              <input className="field-input" type="text" name="location"
                placeholder="e.g. Computer Science Building, Room 301"
                value={form.location} onChange={handleChange} />
            </div>

            {/* Description */}
            <div className="field-group form-full">
              <label className="field-label">Description *</label>
              <textarea className="field-textarea" name="description"
                placeholder="Describe your event — what will students learn, experience, or gain?"
                value={form.description} onChange={handleChange} required
                style={{ minHeight: 130 }} />
            </div>

          </div>

          {/* Live Preview Strip */}
          {form.title && (
            <div className="create-preview">
              <div className="preview-label">Preview</div>
              <div className="preview-strip">
                {imagePreview
                  ? <img src={imagePreview} alt="" className="preview-thumb" />
                  : <div className="preview-initial">{form.title.charAt(0)}</div>
                }
                <div>
                  <div className="preview-title">{form.title}</div>
                  <div className="preview-meta">
                    {form.category}&nbsp;·&nbsp;
                    {form.event_date
                      ? new Date(form.event_date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                      : "Date TBD"}
                    {form.location && <>&nbsp;·&nbsp;{form.location}</>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/faculty/my-events")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? <span style={{ display:"flex", alignItems:"center", gap:8 }}><span className="btn-spinner-dark" />Publishing...</span>
                : "Publish Event"
              }
            </button>
          </div>
        </form>
      </div>

      <style>{createStyles}</style>
    </div>
  );
}

const createStyles = `
.image-upload-area {
  display: flex; align-items: center; justify-content: center;
  border: 2px dashed var(--border); border-radius: 14px;
  padding: 44px 20px; cursor: pointer;
  background: var(--bg);
  transition: border-color var(--tr), background var(--tr);
}
.image-upload-area:hover { border-color: var(--blue); background: var(--surface-hover); }
.image-upload-content { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.image-upload-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--surface); border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  transition: background var(--tr), border-color var(--tr);
}
.image-upload-title {
  font-family: var(--font-display); font-size: 0.97rem; font-weight: 600;
  color: var(--text-primary); margin: 0; transition: color var(--tr);
}
.image-upload-hint { font-size: 0.82rem; color: var(--text-muted); margin: 0; }

.image-preview-box { border-radius: 14px; overflow: hidden; border: 1.5px solid var(--border); position: relative; }
.image-preview-img { width: 100%; height: 240px; object-fit: cover; display: block; }
.image-preview-overlay { position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; }
.image-change-btn, .image-remove-btn {
  padding: 7px 16px; border-radius: 8px;
  font-family: var(--font-body); font-size: 0.83rem; font-weight: 600;
  cursor: pointer; border: none; backdrop-filter: blur(10px);
}
.image-change-btn { background: rgba(255,255,255,0.92); color: #0f0f0f; }
.image-remove-btn { background: rgba(220,38,38,0.9); color: #fff; }
.image-change-btn:hover { background: #fff; }
.image-remove-btn:hover { background: rgba(185,28,28,0.95); }
.image-preview-name {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 14px; background: var(--bg);
  border-top: 1.5px solid var(--border);
  font-size: 0.82rem; color: var(--text-muted);
  transition: background var(--tr), border-color var(--tr);
}

.form-actions {
  display: flex; justify-content: flex-end; gap: 12px;
  margin-top: 28px; padding-top: 24px;
  border-top: 1.5px solid var(--border);
}
.create-preview { margin-top: 24px; padding-top: 24px; border-top: 1.5px solid var(--border); }
.preview-label {
  font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 12px;
}
.preview-strip {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 12px; padding: 12px 16px;
  transition: background var(--tr), border-color var(--tr);
}
.preview-thumb { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.preview-initial {
  width: 48px; height: 48px; border-radius: 10px;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;
  color: #fff; flex-shrink: 0;
}
.preview-title {
  font-family: var(--font-display); font-size: 0.97rem; font-weight: 700;
  color: var(--text-primary); margin-bottom: 3px; transition: color var(--tr);
}
.preview-meta { font-size: 0.82rem; color: var(--text-muted); }
.btn-spinner-dark {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
`;

export default CreateEvent;