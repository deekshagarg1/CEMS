// // // const router = require("express").Router()
// // // const auth = require("../controllers/authController")

// // // router.post("/student/register",auth.studentRegister)

// // // router.post("/student/login",auth.studentLogin)

// // // for
// // // const { facultyLogin } = require("../controllers/facultyController"); 
// // // // ya jahan tumhara faculty controller hai

// // // router.post("/faculty/login", facultyLogin);







// // // module.exports = router


// // const router = require("express").Router();
// // const auth = require("../controllers/authController");

// // // ===== STUDENT =====
// // router.post("/student/register", auth.studentRegister);
// // router.post("/student/login", auth.studentLogin);

// // // ===== FACULTY =====
// // router.post("/faculty/register", auth.facultyRegister);
// // router.post("/faculty/login", auth.facultyLogin);


// // // ---- admin---------------
// // router.post("/admin/login", auth.adminLogin);

// // module.exports = router;


// const router = require("express").Router();
// const auth   = require("../controllers/authController");
// const multer = require("multer");
// const path   = require("path");
// const fs     = require("fs");

// // Profile pics ke liye alag uploads folder
// const profileDir = path.join(__dirname, "../uploads/profiles");
// if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, profileDir),
//   filename:    (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile_${Date.now()}${ext}`);
//   },
// });

// const profileUpload = multer({
//   storage: profileStorage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//   fileFilter: (req, file, cb) => {
//     file.type?.startsWith("image/") || ["image/jpeg","image/jpg","image/png","image/webp"].includes(file.mimetype)
//       ? cb(null, true)
//       : cb(new Error("Only images allowed"), false);
//   },
// });

// // ===== STUDENT =====
// router.post("/student/register", profileUpload.single("profile_pic"), auth.studentRegister);
// router.post("/student/login",    auth.studentLogin);

// // ===== FACULTY =====
// router.post("/faculty/register", profileUpload.single("profile_pic"), auth.facultyRegister);
// router.post("/faculty/login",    auth.facultyLogin);

// // ===== ADMIN =====
// router.post("/admin/login", auth.adminLogin);

// module.exports = router;

const router         = require("express").Router();
const auth           = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const multer         = require("multer");
const path           = require("path");
const fs             = require("fs");

// Profile pics folder
const profileDir = path.join(__dirname, "../uploads/profiles");
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

const profileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, profileDir),
    filename:    (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `profile_${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ["image/jpeg","image/jpg","image/png","image/webp"].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only images allowed"), false);
  },
});

// ===== STUDENT =====
router.post("/student/register", profileUpload.single("profile_pic"), auth.studentRegister);
router.post("/student/login",    auth.studentLogin);
router.get ("/student/profile",  authMiddleware, auth.getStudentProfile);
router.put ("/student/update",   authMiddleware, profileUpload.single("profile_pic"), auth.updateStudentProfile);

// ===== FACULTY =====
router.post("/faculty/register", profileUpload.single("profile_pic"), auth.facultyRegister);
router.post("/faculty/login",    auth.facultyLogin);
router.get ("/faculty/profile",  authMiddleware, auth.getFacultyProfile);
router.put ("/faculty/update",   authMiddleware, profileUpload.single("profile_pic"), auth.updateFacultyProfile);

// ===== ADMIN =====
router.post("/admin/login", auth.adminLogin);

module.exports = router;