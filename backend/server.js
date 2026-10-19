
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const leadsRouter = require('./routes/leads');
const authRouter = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'LeadFlow CRM backend is running!',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend API is working.',
  });
});

// Connect the lead API routes
app.use('/api/leads', leadsRouter);
app.use('/api/auth', authRouter);
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(`LeadFlow backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
