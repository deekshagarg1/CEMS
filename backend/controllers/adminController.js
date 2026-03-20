const db = require("../config/db");

// ===== EVENTS =====
exports.getAllEvents = (req, res) => {
  db.query(
    `SELECT e.*,
      CASE WHEN e.role='faculty' THEN f.name ELSE a.name END as creator_name
     FROM events e
     LEFT JOIN faculty f ON e.created_by = f.faculty_id AND e.role = 'faculty'
     LEFT JOIN admin a ON e.created_by = a.admin_id AND e.role = 'admin'
     ORDER BY e.created_at DESC`,
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      res.json(result);
    }
  );
};

exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, category, event_date, location } = req.body;
  const newImage = req.file ? req.file.filename : null;

  let sql, params;
  if (newImage) {
    sql    = "UPDATE events SET title=?, description=?, category=?, event_date=?, location=?, image=? WHERE event_id=?";
    params = [title, description, category, event_date, location, newImage, id];
  } else {
    sql    = "UPDATE events SET title=?, description=?, category=?, event_date=?, location=? WHERE event_id=?";
    params = [title, description, category, event_date, location, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated" });
  });
};

exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM events WHERE event_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    res.json({ message: "Event deleted" });
  });
};

// ===== STUDENTS =====
exports.getAllStudents = (req, res) => {
  db.query(
    "SELECT student_id, name, email, enrollment_no, course, semester, profile_pic, status, created_at FROM students ORDER BY created_at DESC",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
};

exports.updateStudent = (req, res) => {
  const { id } = req.params;
  const { name, email, enrollment_no, course, semester } = req.body;
  db.query(
    "UPDATE students SET name=?, email=?, enrollment_no=?, course=?, semester=? WHERE student_id=?",
    [name, email, enrollment_no, course, Number(semester), id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Student not found" });
      res.json({ message: "Student updated" });
    }
  );
};

exports.deleteStudent = (req, res) => {
  const { id } = req.params;
  // Registrations cascade delete hogi agar FK set hai
  db.query("DELETE FROM students WHERE student_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    res.json({ message: "Student deleted" });
  });
};

exports.getStudentRegistrations = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT er.registration_id, er.registered_at,
      e.event_id, e.title as event_title, e.event_date, e.location, e.category
     FROM event_registrations er
     JOIN events e ON er.event_id = e.event_id
     WHERE er.student_id = ?
     ORDER BY er.registered_at DESC`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
};

exports.cancelRegistration = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM event_registrations WHERE registration_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    res.json({ message: "Registration cancelled" });
  });
};

// ===== FACULTY =====
exports.getAllFaculty = (req, res) => {
  db.query(
    "SELECT faculty_id, name, email, designation, profile_pic, status, created_at FROM faculty ORDER BY created_at DESC",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
};

exports.deleteFaculty = (req, res) => {
  const { id } = req.params;
  // Delete faculty's events first, then faculty
  db.query("DELETE FROM events WHERE created_by = ? AND role = 'faculty'", [id], (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    db.query("DELETE FROM faculty WHERE faculty_id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server error", detail: err2.message });
      res.json({ message: "Faculty and their events deleted" });
    });
  });
};

exports.toggleFacultyStatus = (req, res) => {
  const { id }     = req.params;
  const { status } = req.body; // "active" or "inactive"
  db.query(
    "UPDATE faculty SET status = ? WHERE faculty_id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Faculty not found" });
      res.json({ message: `Faculty ${status}` });
    }
  );
};

exports.getFacultyEvents = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM events WHERE created_by = ? AND role = 'faculty' ORDER BY created_at DESC",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
};