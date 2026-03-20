// const router = require("express").Router();
// const event = require("../controllers/eventController");
// const authMiddleware = require("../middleware/auth");  // ← naam change

// // PUBLIC
// router.get("/", event.getAllEvents);

// // FACULTY
// router.post("/create", authMiddleware, event.createEvent);
// router.get("/my-events", authMiddleware, event.getMyEvents);
// router.put("/update/:id", authMiddleware, event.updateEvent);
// router.delete("/delete/:id", authMiddleware, event.deleteEvent);

// // STUDENT
// router.post("/register", authMiddleware, event.registerForEvent);
// router.get("/my-registrations", authMiddleware, event.getMyRegistrations);

// // ADMIN
// router.get("/all-registrations", authMiddleware, event.getAllRegistrations);
// router.get("/:id", event.getEventById);

// const upload = require("../middleware/upload");

// // Create route mein single image field
// router.post("/create", authMiddleware, upload.single("image"), event.createEvent);

// module.exports = router;



const router = require("express").Router();
const event = require("../controllers/eventController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

// PUBLIC
router.get("/", event.getAllEvents);
router.get("/my-registrations", authMiddleware, event.getMyRegistrations);
router.get("/all-registrations", authMiddleware, event.getAllRegistrations);
router.get("/my-events", authMiddleware, event.getMyEvents);
router.get("/:id", event.getEventById);

// FACULTY
router.post("/create", authMiddleware, upload.single("image"), event.createEvent);
router.put("/update/:id", authMiddleware, upload.single("image"), event.updateEvent);
router.delete("/delete/:id", authMiddleware, event.deleteEvent);

// STUDENT
router.post("/register", authMiddleware, event.registerForEvent);

// -------------------------------extra-------
// const authMiddleware = require("../middleware/auth");
 
// // Profile fetch
// router.get("/student/profile",  authMiddleware, auth.getStudentProfile);
// router.get("/faculty/profile",  authMiddleware, auth.getFacultyProfile);
 
// // Profile update
// router.put("/student/update",   authMiddleware, profileUpload.single("profile_pic"), auth.updateStudentProfile);
// router.put("/faculty/update",   authMiddleware, profileUpload.single("profile_pic"), auth.updateFacultyProfile);

// ---------------------
module.exports = router;