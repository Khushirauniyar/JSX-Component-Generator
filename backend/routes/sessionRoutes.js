const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSession, getSessions, sendPrompt } = require('../controllers/sessionController');
const upload = require('../middleware/uploadMiddleware');

router.post('/create', protect, createSession);
router.get('/', protect, getSessions);
router.post('/prompt', protect, upload.single('image'), sendPrompt);

module.exports = router;



