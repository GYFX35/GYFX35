const express = require('express');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
const port = 3000;

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '..')));

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: 'ai-services-7abb5',
  location: 'us-central1',
});

const generativeModel = vertex_ai.getGenerativeModel({
  model: 'gemini-1.0-pro-001',
});

// API endpoint for the chatbot
app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  try {
    const streamResult = await generativeModel.generateContentStream(message);
    const response = await streamResult.response;
    res.json({ response: response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// API endpoint for business idea feedback
app.post('/api/feedback', async (req, res) => {
  const { idea } = req.body;
  const prompt = `Provide feedback on the following business idea: ${idea}`;

  try {
    const streamResult = await generativeModel.generateContentStream(prompt);
    const response = await streamResult.response;
    res.json({ response: response.candidates[0].content.parts[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// API endpoint for e-commerce assistant
app.post('/api/ecommerce-assistant', async (req, res) => {
    const { message } = req.body;
    const prompt = `You are an e-commerce assistant. Answer the following user query about products or orders: ${message}`;

    try {
        const streamResult = await generativeModel.generateContentStream(prompt);
        const response = await streamResult.response;
        res.json({ response: response.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// API endpoint for dropshipping assistant
app.post('/api/dropshipping-assistant', async (req, res) => {
    const { message } = req.body;
    const prompt = `You are an assistant knowledgeable about dropshipping. Answer the following user query: ${message}`;

    try {
        const streamResult = await generativeModel.generateContentStream(prompt);
        const response = await streamResult.response;
        res.json({ response: response.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
