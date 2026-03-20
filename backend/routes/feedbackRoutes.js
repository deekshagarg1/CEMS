const router         = require("express").Router();
const feedback       = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/auth");

router.post("/submit",         authMiddleware, feedback.submitFeedback);
router.get ("/event/:id",      authMiddleware, feedback.getEventFeedback);

module.exports = router;