import React, { useState, useEffect } from "react";
import "../assets/css/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [theme, setTheme] = useState("light");
  const [profilePic, setProfilePic] = useState(null);
  const [userName, setUserName] = useState("");

  // ===== CHECK LOGIN =====
  useEffect(() => {
    const checkAuth = () => {
      const storedRole = localStorage.getItem("role");
      const token = localStorage.getItem("token");
      const pic = localStorage.getItem("profilePic");
// ----------------------------------------------
// img src mein directly use karo — already full URL hai
{pic ? <img src={pic} alt="profile" /> : <span>{initials}</span>}
// -----------------------------------------
      const name = localStorage.getItem("userName");
      if (token) {
        setRole(storedRole);
        setProfilePic(pic || null);
        setUserName(name || "");
      } else {
        setRole(null);
        setProfilePic(null);
        setUserName("");
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ===== LOAD SAVED THEME =====
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  // ===== TOGGLE THEME =====
  const toggleTheme = () => {
    if (theme === "light") {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("userName");
    setRole(null);
    setProfilePic(null);
    setUserName("");
    navigate("/");
  };

  const isLoggedIn = !!role;
  const initials = userName ? userName.charAt(0).toUpperCase() : "U";

  // Profile route based on role
  const profileRoute =
    role === "student" ? "/student/profile"
    : role === "faculty" ? "/faculty/profile"
    : "/admin/profile";

  return (
    <nav className="navbar">
      {/* BRAND */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <div className="nav-logo-icon">
         
            <img src="mits_logo.png" alt="logo"/>
        </div>
        <span>CEMS</span>
      </div>

       {/* HAMBURGER  */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </div>

      {/* RIGHT LINKS */}
      <div className={`nav-right ${menuOpen ? "active" : ""}`}>
        {/* COMMON */}
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/events" onClick={() => setMenuOpen(false)}>All Events</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

        {/* THEME */}
        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* ADMIN */}
        {role === "admin" && (
          <>
            <Link to="/admin/manage-students" onClick={() => setMenuOpen(false)}>Students</Link>
            <Link to="/admin/manage-faculty" onClick={() => setMenuOpen(false)}>Faculty</Link>
            <Link to="/admin/manage-events" onClick={() => setMenuOpen(false)}>Manage Events</Link>
            {/* <Link to="/faculty/create-event" onClick={() => setMenuOpen(false)}>Create Event</Link> */}
          </>
        )}

        {/* STUDENT */}
        {role === "student" && (
          <>
            <Link to="/student/registered" onClick={() => setMenuOpen(false)}>Registered Events</Link>
            <Link to="/student/certificates" onClick={() => setMenuOpen(false)}>Certificates</Link>
          </>
        )}

        {/* FACULTY */}
        {role === "faculty" && (
          <>
            <Link to="/faculty/create-event" onClick={() => setMenuOpen(false)}>Create Event</Link>
            <Link to="/faculty/my-events" onClick={() => setMenuOpen(false)}>My Events</Link>
          </>
        )}

        {/* AUTH */}
        {!isLoggedIn ? (
          <div className="auth-buttons">
            <Link to="/login" className="btn login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/sign" className="btn signup" onClick={() => setMenuOpen(false)}>Register</Link>
          </div>
        ) : (
          <>
            {/* PROFILE AVATAR */}
            {/* <Link to={profileRoute} className="nav-profile" onClick={() => setMenuOpen(false)}> */}
                   <Link to='/profile' className="nav-profile" onClick={() => setMenuOpen(false)}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" />
              ) : (
                <div className="nav-avatar-placeholder">{initials}</div>
              )}
              <span>{userName || "Profile"}</span>
            </Link>
            <button onClick={handleLogout} className="btn logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;