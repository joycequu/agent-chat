const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const chatDataFilePath = path.join(__dirname, 'chat_data.json');

// Function to read chat data from the JSON file
const readChatData = () => {
  try {
    const data = fs.readFileSync(chatDataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat data:', error);
    return [];
  }
};

// GET /api/chat-data - Fetch chat data
app.get('/api/chat-data', (req, res) => {
  try {
    const chats = readChatData();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat data' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});