import "../assets/css/Footer.css";
import React from "react";
import { Link } from "react-router-dom";




function Footer() {
  return (
    <div className="footer-main">
      <div className="footer-top">
        {/* BRAND */}
        <div className="footer-top-right">
          <div className="f-logo">
            <div className="f-logo-icon">
             <img src="mits_logo.png" alt="logo"/>
            </div>
            <h3>CEMS</h3>
          </div>
          <p>Streamline your campus events with our comprehensive management platform.</p>
        </div>

        {/* QUICK LINKS */}
        <div className="f-l">
          <strong>Quick Links</strong>
          <Link to="/events">Browse Events</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* FOR STUDENTS */}
        <div className="f-l">
          <strong>For Students</strong>
          <Link to="/sign">Create Account</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/student/registered">My Dashboard</Link>
        </div>

        {/* SUPPORT */}
        <div className="f-l">
          <strong>Support</strong>
          <Link to="/help">Help Center</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 CEMS. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;