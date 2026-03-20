// // // const db = require("../config/db");
// // // const bcrypt = require("bcryptjs");
// // // const jwt = require("jsonwebtoken");

// // // exports.studentRegister = (req,res)=>{

// // // const {name,email,password,enrollment_no,course,semester} = req.body

// // // const hash = bcrypt.hashSync(password,10)

// // // const sql = `
// // // INSERT INTO students
// // // (name,email,password,enrollment_no,course,semester)
// // // VALUES (?,?,?,?,?,?)
// // // `

// // // db.query(sql,[name,email,hash,enrollment_no,course,semester],(err)=>{

// // // if(err) return res.status(400).json(err)

// // // res.json({message:"Student Registered"})

// // // })

// // // }



// // // exports.studentLogin = (req,res)=>{

// // // const {email,password} = req.body

// // // db.query("SELECT * FROM students WHERE email=?",[email],(err,result)=>{

// // // if(result.length==0){
// // // return res.status(401).json({message:"Student not found"})
// // // }

// // // const student = result[0]

// // // const match = bcrypt.compareSync(password,student.password)

// // // if(!match){
// // // return res.status(401).json({message:"Wrong password"})
// // // }

// // // const token = jwt.sign(
// // // {id:student.student_id,role:"student"},
// // // process.env.JWT_SECRET
// // // )

// // // res.json({token})

// // // })

// // // }




// // // exports.facultyRegister = (req, res) => {
// // //   const { name, email, password, designation } = req.body;

// // //   const hash = bcrypt.hashSync(password, 10);

// // //   const sql = `
// // //     INSERT INTO faculty (name, email, password, designation)
// // //     VALUES (?, ?, ?, ?)
// // //   `;

// // //   db.query(sql, [name, email, hash, designation], (err) => {
// // //     if (err) return res.status(400).json(err);
// // //     res.json({ message: "Faculty Registered" });
// // //   });
// // // };

// // // exports.facultyLogin = (req, res) => {
// // //   const { email, password } = req.body;

// // //   db.query("SELECT * FROM faculty WHERE email = ?", [email], (err, result) => {
// // //     if (err) return res.status(500).json({ message: "Server error" });

// // //     if (result.length === 0) {
// // //       return res.status(401).json({ message: "Faculty not found" });
// // //     }

// // //     const faculty = result[0];
// // //     const match = bcrypt.compareSync(password, faculty.password);

// // //     if (!match) {
// // //       return res.status(401).json({ message: "Wrong password" });
// // //     }

// // //     const token = jwt.sign(
// // //       { id: faculty.faculty_id, role: "faculty" },
// // //       process.env.JWT_SECRET
// // //     );

// // //     res.json({ token });
// // //   });
// // // };

// // // exports.adminLogin = (req, res) => {
// // //   const { name, password } = req.body;

// // //   db.query("SELECT * FROM admin WHERE name = ?", [name], (err, result) => {
// // //     if (err) {
// // //       console.error("Admin login DB error:", err); // ← terminal mein dekho
// // //       return res.status(500).json({ message: "Server error", detail: err.message });
// // //     }

// // //     if (result.length === 0) {
// // //       return res.status(401).json({ message: "Admin not found" });
// // //     }

// // //     const admin = result[0];
// // //     const match = bcrypt.compareSync(password, admin.password);

// // //     if (!match) {
// // //       return res.status(401).json({ message: "Wrong password" });
// // //     }

// // //     const token = jwt.sign(
// // //       { id: admin.admin_id, role: "admin" },
// // //       process.env.JWT_SECRET
// // //     );

// // //     res.json({ token });
// // //   });
// // // };



// // const db = require("../config/db");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // // ===== STUDENT =====
// // exports.studentRegister = (req, res) => {
// //   const { name, email, password, enrollment_no, course, semester } = req.body;
// //   const hash = bcrypt.hashSync(password, 10);
// //   const sql = `INSERT INTO students (name, email, password, enrollment_no, course, semester)
// //                VALUES (?, ?, ?, ?, ?, ?)`;
// //   db.query(sql, [name, email, hash, enrollment_no, course, Number(semester)], (err) => {
// //     if (err) return res.status(400).json({ message: err.message });
// //     res.json({ message: "Student Registered" });
// //   });
// // };

// // exports.studentLogin = (req, res) => {
// //   const { email, password } = req.body;
// //   db.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
// //     if (err) return res.status(500).json({ message: "Server error" });
// //     if (result.length === 0) return res.status(401).json({ message: "Student not found" });

// //     const student = result[0];
// //     const match = bcrypt.compareSync(password, student.password);
// //     if (!match) return res.status(401).json({ message: "Wrong password" });

// //     const token = jwt.sign(
// //       { id: student.student_id, role: "student" },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({
// //       token,
// //       role: "student",
// //       name: student.name,
// //       email: student.email,
// //       id: student.student_id,
// //     });
// //   });
// // };

// // // ===== FACULTY =====
// // exports.facultyRegister = (req, res) => {
// //   const { name, email, password, designation } = req.body;
// //   const hash = bcrypt.hashSync(password, 10);
// //   const sql = `INSERT INTO faculty (name, email, password, designation) VALUES (?, ?, ?, ?)`;
// //   db.query(sql, [name, email, hash, designation], (err) => {
// //     if (err) return res.status(400).json({ message: err.message });
// //     res.json({ message: "Faculty Registered" });
// //   });
// // };

// // exports.facultyLogin = (req, res) => {
// //   const { email, password } = req.body;
// //   db.query("SELECT * FROM faculty WHERE email = ?", [email], (err, result) => {
// //     if (err) return res.status(500).json({ message: "Server error" });
// //     if (result.length === 0) return res.status(401).json({ message: "Faculty not found" });

// //     const faculty = result[0];
// //     const match = bcrypt.compareSync(password, faculty.password);
// //     if (!match) return res.status(401).json({ message: "Wrong password" });

// //     const token = jwt.sign(
// //       { id: faculty.faculty_id, role: "faculty" },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({
// //       token,
// //       role: "faculty",
// //       name: faculty.name,
// //       email: faculty.email,
// //       id: faculty.faculty_id,
// //     });
// //   });
// // };

// // // ===== ADMIN =====
// // exports.adminLogin = (req, res) => {
// //   const { name, password } = req.body;

// //   console.log("Admin login attempt — name:", name);

// //   db.query("SELECT * FROM admin WHERE name = ?", [name], (err, result) => {
// //     if (err) {
// //       console.error("Admin DB error:", err);
// //       return res.status(500).json({ message: "Server error", detail: err.message });
// //     }

// //     console.log("Admin query result count:", result.length);

// //     if (result.length === 0) {
// //       return res.status(401).json({ message: "Admin not found" });
// //     }

// //     const admin = result[0];
// //     console.log("Stored hash:", admin.password);

// //     const match = bcrypt.compareSync(password, admin.password);
// //     console.log("Password match:", match);

// //     if (!match) {
// //       return res.status(401).json({ message: "Wrong password" });
// //     }

// //     const token = jwt.sign(
// //       { id: admin.admin_id, role: "admin" },
// //       process.env.JWT_SECRET,
// //       { expiresIn: "7d" }
// //     );

// //     res.json({
// //       token,
// //       role: "admin",
// //       name: admin.name,
// //       id: admin.admin_id,
// //     });
// //   });
// // };



// const db     = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt    = require("jsonwebtoken");

// // ===== STUDENT =====
// exports.studentRegister = (req, res) => {
//   const { name, email, password, enrollment_no, course, semester } = req.body;
//   const profile_pic = req.file ? `profiles/${req.file.filename}` : null;

//   const hash = bcrypt.hashSync(password, 10);
//   const sql  = `INSERT INTO students (name, email, password, enrollment_no, course, semester, profile_pic)
//                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

//   db.query(sql, [name, email, hash, enrollment_no, course, Number(semester), profile_pic], (err) => {
//     if (err) return res.status(400).json({ message: err.message });
//     res.json({ message: "Student Registered" });
//   });
// };

// exports.studentLogin = (req, res) => {
//   const { email, password } = req.body;
//   db.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
//     if (err) return res.status(500).json({ message: "Server error" });
//     if (result.length === 0) return res.status(401).json({ message: "Student not found" });

//     const student = result[0];
//     const match   = bcrypt.compareSync(password, student.password);
//     if (!match) return res.status(401).json({ message: "Wrong password" });

//     const token = jwt.sign(
//       { id: student.student_id, role: "student" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       role:        "student",
//       name:        student.name,
//       email:       student.email,
//       id:          student.student_id,
//       profile_pic: student.profile_pic,
//     });
//   });
// };

// // ===== FACULTY =====
// exports.facultyRegister = (req, res) => {
//   const { name, email, password, designation } = req.body;
//   const profile_pic = req.file ? `profiles/${req.file.filename}` : null;

//   const hash = bcrypt.hashSync(password, 10);
//   const sql  = `INSERT INTO faculty (name, email, password, designation, profile_pic)
//                 VALUES (?, ?, ?, ?, ?)`;

//   db.query(sql, [name, email, hash, designation, profile_pic], (err) => {
//     if (err) return res.status(400).json({ message: err.message });
//     res.json({ message: "Faculty Registered" });
//   });
// };

// exports.facultyLogin = (req, res) => {
//   const { email, password } = req.body;
//   db.query("SELECT * FROM faculty WHERE email = ?", [email], (err, result) => {
//     if (err) return res.status(500).json({ message: "Server error" });
//     if (result.length === 0) return res.status(401).json({ message: "Faculty not found" });

//     const faculty = result[0];
//     const match   = bcrypt.compareSync(password, faculty.password);
//     if (!match) return res.status(401).json({ message: "Wrong password" });

//     const token = jwt.sign(
//       { id: faculty.faculty_id, role: "faculty" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       role:        "faculty",
//       name:        faculty.name,
//       email:       faculty.email,
//       id:          faculty.faculty_id,
//       profile_pic: faculty.profile_pic,
//     });
//   });
// };

// // ===== ADMIN =====
// exports.adminLogin = (req, res) => {
//   const { name, password } = req.body;

//   db.query("SELECT * FROM admin WHERE name = ?", [name], (err, result) => {
//     if (err) return res.status(500).json({ message: "Server error", detail: err.message });
//     if (result.length === 0) return res.status(401).json({ message: "Admin not found" });

//     const admin = result[0];
//     const match = bcrypt.compareSync(password, admin.password);
//     if (!match) return res.status(401).json({ message: "Wrong password" });

//     const token = jwt.sign(
//       { id: admin.admin_id, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       role: "admin",
//       name: admin.name,
//       id:   admin.admin_id,
//     });
//   });
// };

const db     = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

// ===== STUDENT REGISTER =====
exports.studentRegister = (req, res) => {
  const { name, email, password, enrollment_no, course, semester } = req.body;
  const profile_pic = req.file ? `profiles/${req.file.filename}` : null;
  const hash = bcrypt.hashSync(password, 10);
  const sql  = `INSERT INTO students (name, email, password, enrollment_no, course, semester, profile_pic)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, hash, enrollment_no, course, Number(semester), profile_pic], (err) => {
    if (err) return res.status(400).json({ message: err.message });
    res.json({ message: "Student Registered" });
  });
};

// ===== STUDENT LOGIN =====
exports.studentLogin = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM students WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0) return res.status(401).json({ message: "Student not found" });
    const student = result[0];
    const match   = bcrypt.compareSync(password, student.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });
    const token = jwt.sign(
      { id: student.student_id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      role:        "student",
      name:        student.name,
      email:       student.email,
      id:          student.student_id,
      profile_pic: student.profile_pic,
    });
  });
};

// ===== STUDENT PROFILE GET =====
exports.getStudentProfile = (req, res) => {
  const id = req.user.id;
  db.query(
    "SELECT student_id, name, email, enrollment_no, course, semester, profile_pic FROM students WHERE student_id = ?",
    [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(result[0]);
    }
  );
};

// ===== STUDENT PROFILE UPDATE =====
exports.updateStudentProfile = (req, res) => {
  const id          = req.user.id;
  const { name, course, semester } = req.body;
  const profile_pic = req.file ? `profiles/${req.file.filename}` : null;

  let sql, params;
  if (profile_pic) {
    sql    = "UPDATE students SET name=?, course=?, semester=?, profile_pic=? WHERE student_id=?";
    params = [name, course, semester, profile_pic, id];
  } else {
    sql    = "UPDATE students SET name=?, course=?, semester=? WHERE student_id=?";
    params = [name, course, semester, id];
  }

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    res.json({ message: "Profile updated", profile_pic });
  });
};

// ===== FACULTY REGISTER =====
exports.facultyRegister = (req, res) => {
  const { name, email, password, designation } = req.body;
  const profile_pic = req.file ? `profiles/${req.file.filename}` : null;
  const hash = bcrypt.hashSync(password, 10);
  const sql  = `INSERT INTO faculty (name, email, password, designation, profile_pic) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, email, hash, designation, profile_pic], (err) => {
    if (err) return res.status(400).json({ message: err.message });
    res.json({ message: "Faculty Registered" });
  });
};

// ===== FACULTY LOGIN =====
exports.facultyLogin = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM faculty WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (result.length === 0) return res.status(401).json({ message: "Faculty not found" });
    const faculty = result[0];
    const match   = bcrypt.compareSync(password, faculty.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });
    const token = jwt.sign(
      { id: faculty.faculty_id, role: "faculty" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      role:        "faculty",
      name:        faculty.name,
      email:       faculty.email,
      id:          faculty.faculty_id,
      profile_pic: faculty.profile_pic,
    });
  });
};

// ===== FACULTY PROFILE GET =====
exports.getFacultyProfile = (req, res) => {
  const id = req.user.id;
  db.query(
    "SELECT faculty_id, name, email, designation, profile_pic FROM faculty WHERE faculty_id = ?",
    [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0) return res.status(404).json({ message: "Not found" });
      res.json(result[0]);
    }
  );
};

// ===== FACULTY PROFILE UPDATE =====
exports.updateFacultyProfile = (req, res) => {
  const id             = req.user.id;
  const { name, designation } = req.body;
  const profile_pic    = req.file ? `profiles/${req.file.filename}` : null;

  let sql, params;
  if (profile_pic) {
    sql    = "UPDATE faculty SET name=?, designation=?, profile_pic=? WHERE faculty_id=?";
    params = [name, designation, profile_pic, id];
  } else {
    sql    = "UPDATE faculty SET name=?, designation=? WHERE faculty_id=?";
    params = [name, designation, id];
  }

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    res.json({ message: "Profile updated", profile_pic });
  });
};

// ===== ADMIN LOGIN =====
exports.adminLogin = (req, res) => {
  const { name, password } = req.body;
  db.query("SELECT * FROM admin WHERE name = ?", [name], (err, result) => {
    if (err) return res.status(500).json({ message: "Server error", detail: err.message });
    if (result.length === 0) return res.status(401).json({ message: "Admin not found" });
    const admin = result[0];
    const match = bcrypt.compareSync(password, admin.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });
    const token = jwt.sign(
      { id: admin.admin_id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      role: "admin",
      name: admin.name,
      id:   admin.admin_id,
    });
  });
};