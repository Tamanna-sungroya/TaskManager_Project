const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { askAssistant, streamAssistant } = require("../controllers/aiController");

const router = express.Router();

router.post("/ask", protect, askAssistant);
router.post("/stream", protect, streamAssistant);

module.exports = router;