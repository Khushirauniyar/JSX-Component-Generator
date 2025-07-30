const Session = require('../models/Session');
const aiGenerator = require('../utils/aiGenerator');

exports.createSession = async (req, res) => {
  try {
    const session = await Session.create({ user: req.user._id });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendPrompt = async (req, res) => {
  try {
    const { sessionId, prompt } = req.body;
    const imageBuffer = req.file ? req.file.buffer.toString('base64') : null;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.chatHistory.push({ role: 'user', message: prompt });

    const aiResponse = await aiGenerator(prompt, imageBuffer);
    session.chatHistory.push({ role: 'ai', message: aiResponse.jsx });
    session.componentCode = aiResponse;

    await session.save();
    res.json(aiResponse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

