async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Placeholder: echo the message. Replace with your LLM or chat logic.
    const reply = `You said: ${message.trim()}`;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
}

module.exports = { chat };
