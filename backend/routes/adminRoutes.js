const router         = require("express").Router();
const admin          = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const upload         = require("../middleware/upload");

router.use(authMiddleware);

// ===== EVENTS =====
router.get   ("/events",                      admin.getAllEvents);
router.put   ("/events/:id",                  upload.single("image"), admin.updateEvent);
router.delete("/events/:id",                  admin.deleteEvent);

// ===== STUDENTS =====
router.get   ("/students",                    admin.getAllStudents);
router.put   ("/students/:id",                admin.updateStudent);
router.delete("/students/:id",                admin.deleteStudent);
router.get   ("/students/:id/registrations",  admin.getStudentRegistrations);
router.delete("/registrations/:id",           admin.cancelRegistration);

// ===== FACULTY =====
router.get   ("/faculty",                     admin.getAllFaculty);
router.delete("/faculty/:id",                 admin.deleteFaculty);
router.patch ("/faculty/:id/status",          admin.toggleFacultyStatus);
router.get   ("/faculty/:id/events",          admin.getFacultyEvents);

module.exports = router;