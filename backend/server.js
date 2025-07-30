const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const { createClient } = require('redis');

dotenv.config();
connectDB();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-react-component-studio.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ Safe Redis (skip in dev if not required)
let redisClient = null;
if (process.env.REDIS_URL && isProd) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: { tls: true, rejectUnauthorized: false }
    });

    redisClient.connect()
      .then(() => console.log('✅ Redis Connected'))
      .catch(err => console.error('Redis Connect Error:', err.message));

    redisClient.on('error', err => console.error('Redis Error:', err.message));

    app.set('redis', redisClient);
  } catch (err) {
    console.log('⚠️ Redis initialization failed:', err.message);
  }
} else {
  console.log('⚠️ Skipping Redis connection (no URL or dev mode)');
}

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

// ✅ Graceful shutdown
process.on('SIGTERM', async () => {
  if (redisClient) await redisClient.quit();
  process.exit(0);
});
