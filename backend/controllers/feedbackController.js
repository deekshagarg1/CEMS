const db = require("../config/db");

exports.submitFeedback = (req, res) => {
  const student_id = req.user.id;
  const { event_id, rating, organization, content, highlight, improve, recommend, comments } = req.body;

  // Check already submitted
  db.query("SELECT * FROM feedback WHERE event_id=? AND student_id=?",
    [event_id, student_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length > 0) return res.json({ message: "Feedback already submitted" });

      db.query(
        `INSERT INTO feedback (event_id, student_id, rating, organization, content, highlight, improve, recommend, comments)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [event_id, student_id, rating, organization, content, highlight, improve, recommend, comments],
        (err) => {
          if (err) return res.status(500).json({ message: "Server error", detail: err.message });
          res.json({ message: "Feedback submitted" });
        }
      );
    }
  );
};

exports.getEventFeedback = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT f.*, s.name as student_name 
     FROM feedback f
     JOIN students s ON f.student_id = s.student_id
     WHERE f.event_id = ?
     ORDER BY f.created_at DESC`,
    [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      res.json(result);
    }
  );
};