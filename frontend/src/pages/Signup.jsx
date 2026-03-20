
// import "../assets/css/Signup.css";

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";


// // Calendar SVG
// const CEMSIcon = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//     <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none"/>
//     <path d="M3 9h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//     <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
//     <rect x="7" y="13" width="3" height="3" rx="0.5" fill="white"/>
//     <rect x="14" y="13" width="3" height="3" rx="0.5" fill="white"/>
//   </svg>
// );

// const UserIcon = () => (
//   <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//     <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="1.5"/>
//     <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
//   </svg>
// );

// function Signup() {
//   const navigate = useNavigate();
//   const [role, setRole] = useState("student");
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [profileBase64, setProfileBase64] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//     enrollment_no: "",
//     course: "",
//     semester: "",
//     designation: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Profile pic handler — compresses image before storing
//   const handleProfilePic = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const img = new Image();
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         const MAX = 200; // max width/height in px
//         let { width, height } = img;
//         if (width > height) {
//           if (width > MAX) { height = (height * MAX) / width; width = MAX; }
//         } else {
//           if (height > MAX) { width = (width * MAX) / height; height = MAX; }
//         }
//         canvas.width = width;
//         canvas.height = height;
//         canvas.getContext("2d").drawImage(img, 0, 0, width, height);
//         const compressed = canvas.toDataURL("image/jpeg", 0.7); // 70% quality JPEG
//         setProfilePreview(compressed);
//         setProfileBase64(compressed);
//       };
//       img.src = reader.result;
//     };
//     reader.readAsDataURL(file);
//   };

//   // -----------------------------
//   const handleSignup = async (e) => {
//   e.preventDefault();

//   try {
//     const studentPayload = {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       enrollment_no: formData.enrollment_no,
//       course: formData.course,
//       semester: Number(formData.semester),  // ← string se number
//     };


//     // --------------------------------
//     const facultyPayload = {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       designation: formData.designation,
//     };

//     console.log("Payload:", role === "student" ? studentPayload : facultyPayload);

//     if (role === "student") {
//       await axios.post("http://localhost:5000/api/auth/student/register", studentPayload);
//     }
//     if (role === "faculty") {
//       await axios.post("http://localhost:5000/api/auth/faculty/register", facultyPayload);
//     }

//     if (profileBase64) localStorage.setItem("profilePic", profileBase64);
//     if (formData.name) localStorage.setItem("userName", formData.name);

//     alert("Registered Successfully ✅");
//     navigate("/login");

//   } catch (err) {
//     const backendMsg =
//       err.response?.data?.message ||
//       err.response?.data?.sqlMessage ||   // ← MySQL error message
//       err.response?.data?.code ||         // ← MySQL error code e.g. ER_DUP_ENTRY
//       JSON.stringify(err.response?.data) ||
//       err.message;
//     console.error("Full error:", err.response?.data);
//     alert("Signup Failed ❌\n\nReason: " + backendMsg);
//   }
// };

//   return (
//     <div className="signup-page">
//       <div className="signup-card">
//         {/* LOGO */}
//         <div className="auth-logo">
//           <div className="auth-logo-icon">
//             <CEMSIcon />
//           </div>
//         </div>

//         <h2 className="auth-title">Create Account</h2>
//         <p className="auth-subtitle">Join our event management platform</p>

//         {/* ROLE TABS */}
//         <div className="role-tabs">
//           <button
//             type="button"
//             className={`role-tab ${role === "student" ? "active" : ""}`}
//             onClick={() => setRole("student")}
//           >
//             Student
//           </button>
//           <button
//             type="button"
//             className={`role-tab ${role === "faculty" ? "active" : ""}`}
//             onClick={() => setRole("faculty")}
//           >
//             Faculty
//           </button>
//         </div>

//         <form onSubmit={handleSignup}>
//           {/* PROFILE PIC UPLOAD */}
//           <div className="profile-upload-area">
//             <div className="profile-upload-circle">
//               {profilePreview ? (
//                 <img src={profilePreview} alt="Profile preview" />
//               ) : (
//                 <div className="upload-placeholder">
//                   <UserIcon />
//                   <span>Upload Photo</span>
//                 </div>
//               )}
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfilePic}
//               />
//             </div>
//             <span className="profile-upload-label">
//               {profilePreview ? "Click to change photo" : "Profile Picture (optional)"}
//             </span>
//           </div>

//           {/* FULL NAME */}
//           <div className="field-group">
//             <label className="field-label">Full Name</label>
//             <input
//               className="field-input"
//               type="text"
//               name="name"
//               placeholder="John Doe"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           {/* EMAIL */}
//           <div className="field-group">
//             <label className="field-label">College Email</label>
//             <input
//               className="field-input"
//               type="email"
//               name="email"
//               placeholder="john.doe@college.edu"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           {/* STUDENT FIELDS */}
//           {role === "student" && (
//             <>
//               <div className="field-group">
//                 <label className="field-label">Enrollment Number</label>
//                 <input
//                   className="field-input"
//                   type="text"
//                   name="enrollment_no"
//                   placeholder="e.g. 0901CS221001"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="field-group">
//                 <label className="field-label">Course</label>
//                 <input
//                   className="field-input"
//                   type="text"
//                   name="course"
//                   placeholder="Computer Science"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="field-group">
//                 <label className="field-label">Semester</label>
//                 <input
//                   className="field-input"
//                   type="number"
//                   name="semester"
//                   placeholder="e.g. 4"
//                   min="1"
//                   max="8"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </>
//           )}

//           {/* FACULTY FIELDS */}
//           {role === "faculty" && (
//             <div className="field-group">
//               <label className="field-label">Designation</label>
//               <input
//                 className="field-input"
//                 type="text"
//                 name="designation"
//                 placeholder="e.g. Assistant Professor"
//                 required
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {/* PASSWORD */}
//           <div className="field-group">
//             <label className="field-label">Password</label>
//             <input
//               className="field-input"
//               type="password"
//               name="password"
//               placeholder="••••••••"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <div className="field-group">
//             <label className="field-label">Confirm Password</label>
//             <input
//               className="field-input"
//               type="password"
//               name="confirm_password"
//               placeholder="••••••••"
//               required
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className="btn-submit">Create Account</button>
//         </form>

//         <p className="auth-footer">
//           Already have an account?{" "}
//           <Link to="/login">Sign In</Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;



import "../assets/css/Signup.css";
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const CEMSIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="17" rx="3" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M3 9h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="7" y="13" width="3" height="3" rx="0.5" fill="white"/>
    <rect x="14" y="13" width="3" height="3" rx="0.5" fill="white"/>
  </svg>
);

const UserIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="#9ca3af" strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function Signup() {
  const navigate   = useNavigate();
  const fileRef    = useRef(null); // ← ref for file input
  const [role, setRole] = useState("student");
  const [profileFile, setProfileFile]       = useState(null);   // actual file
  const [profilePreview, setProfilePreview] = useState(null);   // base64 for display
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirm_password: "",
    enrollment_no: "", course: "", semester: "", designation: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Profile pic — store file + compressed preview
  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileFile(file); // ← actual file for FormData

    // Compressed preview ke liye
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = (height * MAX) / width; width = MAX; }
        } else {
          if (height > MAX) { width = (width * MAX) / height; height = MAX; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        setProfilePreview(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("name",     formData.name);
      fd.append("email",    formData.email);
      fd.append("password", formData.password);

      if (role === "student") {
        fd.append("enrollment_no", formData.enrollment_no);
        fd.append("course",        formData.course);
        fd.append("semester",      Number(formData.semester));
      }
      if (role === "faculty") {
        fd.append("designation", formData.designation);
      }

      // Profile pic — actual file append karo
      if (profileFile) {
        fd.append("profile_pic", profileFile);
      }

      const url = role === "student"
        ? "http://localhost:5000/api/auth/student/register"
        : "http://localhost:5000/api/auth/faculty/register";

      await axios.post(url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Preview localStorage mein sirf display ke liye (Nav mein use hoga)
      if (profilePreview) localStorage.setItem("profilePic", profilePreview);
      localStorage.setItem("userName", formData.name);

      alert("Registered Successfully ✅");
      navigate("/login");

    } catch (err) {
      const msg = err.response?.data?.message ||
                  err.response?.data?.sqlMessage ||
                  err.message;
      console.error("Signup error:", err.response?.data);
      alert("Signup Failed ❌\n" + msg);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><CEMSIcon /></div>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our event management platform</p>

        {/* ROLE TABS */}
        <div className="role-tabs">
          <button type="button"
            className={`role-tab ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}>Student</button>
          <button type="button"
            className={`role-tab ${role === "faculty" ? "active" : ""}`}
            onClick={() => setRole("faculty")}>Faculty</button>
        </div>

        <form onSubmit={handleSignup}>
          {/* PROFILE PIC */}
          <div className="profile-upload-area">
            <div className="profile-upload-circle" onClick={() => fileRef.current?.click()}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile preview" />
              ) : (
                <div className="upload-placeholder">
                  <UserIcon />
                  <span>Upload Photo</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePic}
                style={{ display: "none" }}
              />
            </div>
            <span className="profile-upload-label">
              {profilePreview ? "Click to change photo" : "Profile Picture (optional)"}
            </span>
          </div>

          {/* COMMON FIELDS */}
          <div className="field-group">
            <label className="field-label">Full Name</label>
            <input className="field-input" type="text" name="name"
              placeholder="John Doe" required onChange={handleChange} />
          </div>

          <div className="field-group">
            <label className="field-label">College Email</label>
            <input className="field-input" type="email" name="email"
              placeholder="john.doe@college.edu" required onChange={handleChange} />
          </div>

          {/* STUDENT FIELDS */}
          {role === "student" && (<>
            <div className="field-group">
              <label className="field-label">Enrollment Number</label>
              <input className="field-input" type="text" name="enrollment_no"
                placeholder="e.g. 0901CS221001" required onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">Course</label>
              <input className="field-input" type="text" name="course"
                placeholder="Computer Science" required onChange={handleChange} />
            </div>
            <div className="field-group">
              <label className="field-label">Semester</label>
              <input className="field-input" type="number" name="semester"
                placeholder="e.g. 4" min="1" max="8" required onChange={handleChange} />
            </div>
          </>)}

          {/* FACULTY FIELDS */}
          {role === "faculty" && (
            <div className="field-group">
              <label className="field-label">Designation</label>
              <input className="field-input" type="text" name="designation"
                placeholder="e.g. Assistant Professor" required onChange={handleChange} />
            </div>
          )}

          {/* PASSWORD */}
          <div className="field-group">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" name="password"
              placeholder="••••••••" required onChange={handleChange} />
          </div>

          <div className="field-group">
            <label className="field-label">Confirm Password</label>
            <input className="field-input" type="password" name="confirm_password"
              placeholder="••••••••" required onChange={handleChange} />
          </div>

          <button type="submit" className="btn-submit">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;