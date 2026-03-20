// const db = require("../config/db");

// // ===== SABKO DIKHEGA =====
// exports.getAllEvents = (req, res) => {
//   db.query(
//     `SELECT e.*, 
//       CASE WHEN e.role='faculty' THEN f.name ELSE a.name END as creator_name
//      FROM events e
//      LEFT JOIN faculty f ON e.created_by = f.faculty_id AND e.role = 'faculty'
//      LEFT JOIN admin a ON e.created_by = a.admin_id AND e.role = 'admin'
//      ORDER BY e.created_at DESC`,
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//       res.json(result);
//     }
//   );
// };

// // ===== FACULTY - EVENT BANAO =====
// exports.createEvent = (req, res) => {
//   // multer ke saath body alag aata hai — console karo debug ke liye
//   console.log("Body:", req.body);
//   console.log("File:", req.file);

//   const { title, description, category, event_date, location } = req.body;

//   if (!title || !description) {
//     return res.status(400).json({ message: "Title and description required" });
//   }

//   const image    = req.file ? req.file.filename : null;
//   const created_by = req.user.id;
//   const role     = req.user.role;

//   const sql = `
//     INSERT INTO events (title, description, category, event_date, location, image, created_by, role)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(sql,
//     [title, description, category || "Other", event_date, location, image, created_by, role],
//     (err, result) => {
//       if (err) {
//         console.error("Create event DB error:", err);
//         return res.status(500).json({ message: "Server error", detail: err.message });
//       }
//       res.json({ message: "Event created", event_id: result.insertId });
//     }
//   );
// };

// // ===== FACULTY - APNE EVENTS =====
// exports.getMyEvents = (req, res) => {
//   const created_by = req.user.id;
//   const role = req.user.role;

//   db.query(
//     "SELECT * FROM events WHERE created_by = ? AND role = ? ORDER BY created_at DESC",
//     [created_by, role],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//       res.json(result);
//     }
//   );
// };

// // ===== FACULTY - EVENT UPDATE =====
// // ===== PASTE THIS in eventController.js =====
// // Replace your existing updateEvent function with this:

// exports.updateEvent = (req, res) => {
//   const { title, description, category, event_date, location } = req.body;
//   const { id } = req.params;
//   const created_by = req.user.id;

//   // If new image uploaded, use it; else keep existing
//   const newImage = req.file ? req.file.filename : null;

//   // Build query dynamically based on whether image is updated
//   let sql, params;

//   if (newImage) {
//     sql = `UPDATE events 
//            SET title=?, description=?, category=?, event_date=?, location=?, image=?
//            WHERE event_id=? AND created_by=?`;
//     params = [title, description, category, event_date, location, newImage, id, created_by];
//   } else {
//     sql = `UPDATE events 
//            SET title=?, description=?, category=?, event_date=?, location=?
//            WHERE event_id=? AND created_by=?`;
//     params = [title, description, category, event_date, location, id, created_by];
//   }

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       console.error("Update event error:", err);
//       return res.status(500).json({ message: "Server error", detail: err.message });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Event not found or not authorized" });
//     }
//     res.json({ message: "Event updated" });
//   });
// };

// // ===== FACULTY - EVENT DELETE =====
// exports.deleteEvent = (req, res) => {
//   const { id } = req.params;
//   const created_by = req.user.id;

//   db.query(
//     "DELETE FROM events WHERE event_id=? AND created_by=?",
//     [id, created_by],
//     (err) => {
//       if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//       res.json({ message: "Event deleted" });
//     }
//   );
// };

// // ===== STUDENT - EVENT REGISTER =====
// exports.registerForEvent = (req, res) => {
//   const student_id = req.user.id;
//   const { event_id } = req.body;

//   // Pehle check karo already registered hai ya nahi
//   db.query(
//     "SELECT * FROM event_registrations WHERE event_id=? AND student_id=?",
//     [event_id, student_id],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error" });
//       if (result.length > 0) return res.status(400).json({ message: "Already registered" });

//       db.query(
//         "INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)",
//         [event_id, student_id],
//         (err) => {
//           if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//           res.json({ message: "Registered successfully" });
//         }
//       );
//     }
//   );
// };

// // ===== STUDENT - REGISTERED EVENTS =====
// exports.getMyRegistrations = (req, res) => {
//   const student_id = req.user.id;

//   db.query(
//     `SELECT e.*, er.registered_at 
//      FROM event_registrations er
//      JOIN events e ON er.event_id = e.event_id
//      WHERE er.student_id = ?
//      ORDER BY er.registered_at DESC`,
//     [student_id],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//       res.json(result);
//     }
//   );
// };

// // ===== ADMIN - SAB REGISTRATIONS =====
// exports.getAllRegistrations = (req, res) => {
//   db.query(
//     `SELECT er.*, 
//       s.name as student_name, s.email as student_email, 
//       s.enrollment_no, s.course, s.semester,
//       e.title as event_title, e.event_date, e.location
//      FROM event_registrations er
//      JOIN students s ON er.student_id = s.student_id
//      JOIN events e ON er.event_id = e.event_id
//      ORDER BY er.registered_at DESC`,
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//       res.json(result);
//     }
//   );
// };


// exports.createEvent = (req, res) => {
//   const { title, description, category, event_date, location } = req.body;
//   const sql = `INSERT INTO events (title, description, category, event_date, location, created_by, role)
//                VALUES (?, ?, ?, ?, ?, ?, ?)`;
//   db.query(sql, [title, description, category, event_date, location, req.user.id, req.user.role], (err, result) => {
//     if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//     res.json({ message: "Event created", event_id: result.insertId });
//   });
// };



// exports.getEventById = (req, res) => {
//   const { id } = req.params;
//   db.query(
//     `SELECT e.*, 
//       CASE WHEN e.role='faculty' THEN f.name ELSE a.name END as creator_name
//      FROM events e
//      LEFT JOIN faculty f ON e.created_by = f.faculty_id AND e.role = 'faculty'
//      LEFT JOIN admin a ON e.created_by = a.admin_id AND e.role = 'admin'
//      WHERE e.event_id = ?`,
//     [id],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error" });
//       if (result.length === 0) return res.status(404).json({ message: "Not found" });
//       res.json(result[0]);
//     }
//   );
// };


const db = require("../config/db");

// ===== SABKO DIKHEGA =====
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

// ===== FACULTY - EVENT BANAO (WITH IMAGE) =====
exports.createEvent = (req, res) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  const { title, description, category, event_date, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  const image      = req.file ? req.file.filename : null;
  const created_by = req.user.id;
  const role       = req.user.role;

  const sql = `
    INSERT INTO events (title, description, category, event_date, location, image, created_by, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [title, description, category || "Other", event_date, location, image, created_by, role],
    (err, result) => {
      if (err) {
        console.error("Create event DB error:", err);
        return res.status(500).json({ message: "Server error", detail: err.message });
      }
      res.json({ message: "Event created", event_id: result.insertId });
    }
  );
};

// ===== FACULTY - APNE EVENTS =====
exports.getMyEvents = (req, res) => {
  const created_by = req.user.id;
  const role = req.user.role;

  db.query(
    "SELECT * FROM events WHERE created_by = ? AND role = ? ORDER BY created_at DESC",
    [created_by, role],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      res.json(result);
    }
  );
};

// ===== FACULTY - EVENT UPDATE (WITH IMAGE) =====
exports.updateEvent = (req, res) => {
  const { title, description, category, event_date, location } = req.body;
  const { id } = req.params;
  const created_by = req.user.id;
  const newImage = req.file ? req.file.filename : null;

  let sql, params;

  if (newImage) {
    sql = `UPDATE events 
           SET title=?, description=?, category=?, event_date=?, location=?, image=?
           WHERE event_id=? AND created_by=?`;
    params = [title, description, category, event_date, location, newImage, id, created_by];
  } else {
    sql = `UPDATE events 
           SET title=?, description=?, category=?, event_date=?, location=?
           WHERE event_id=? AND created_by=?`;
    params = [title, description, category, event_date, location, id, created_by];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Update event error:", err);
      return res.status(500).json({ message: "Server error", detail: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found or not authorized" });
    }
    res.json({ message: "Event updated" });
  });
};

// ===== FACULTY - EVENT DELETE =====
exports.deleteEvent = (req, res) => {
  const { id } = req.params;
  const created_by = req.user.id;

  db.query(
    "DELETE FROM events WHERE event_id=? AND created_by=?",
    [id, created_by],
    (err) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      res.json({ message: "Event deleted" });
    }
  );
};

// ===== STUDENT - EVENT REGISTER =====
exports.registerForEvent = (req, res) => {
  const student_id = req.user.id;
  const { event_id } = req.body;

  db.query(
    "SELECT * FROM event_registrations WHERE event_id=? AND student_id=?",
    [event_id, student_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length > 0) return res.status(400).json({ message: "Already registered" });

      db.query(
        "INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)",
        [event_id, student_id],
        (err) => {
          if (err) return res.status(500).json({ message: "Server error", detail: err.message });
          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
};

// ===== STUDENT - REGISTERED EVENTS =====
exports.getMyRegistrations = (req, res) => {
  const student_id = req.user.id;

  db.query(
    `SELECT e.*, er.registered_at 
     FROM event_registrations er
     JOIN events e ON er.event_id = e.event_id
     WHERE er.student_id = ?
     ORDER BY er.registered_at DESC`,
    [student_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      res.json(result);
    }
  );
};

// ===== ADMIN - SAB REGISTRATIONS =====
exports.getAllRegistrations = (req, res) => {
  db.query(
    `SELECT er.*, 
      s.name as student_name, s.email as student_email, 
      s.enrollment_no, s.course, s.semester,
      e.title as event_title, e.event_date, e.location
     FROM event_registrations er
     JOIN students s ON er.student_id = s.student_id
     JOIN events e ON er.event_id = e.event_id
     ORDER BY er.registered_at DESC`,
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error", detail: err.message });
      res.json(result);
    }
  );
};

// ===== SINGLE EVENT BY ID =====
exports.getEventById = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT e.*, 
      CASE WHEN e.role='faculty' THEN f.name ELSE a.name END as creator_name
     FROM events e
     LEFT JOIN faculty f ON e.created_by = f.faculty_id AND e.role = 'faculty'
     LEFT JOIN admin a ON e.created_by = a.admin_id AND e.role = 'admin'
     WHERE e.event_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(result[0]);
    }
  );
};