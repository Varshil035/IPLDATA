import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import playerRouter from './routes/player.routes';

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://ipldata25.vercel.app',
    'https://www.ipldata.in',
    'https://ipldata.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/players', playerRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV,
    allowedOrigins: [
      'http://localhost:3000',
      'https://ipldata25.vercel.app',
      'https://www.ipldata.in'
    ]
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Start server
const server = app.listen(Number(port), () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('Allowed Origins:', [
    'http://localhost:3000',
    'https://ipldata25.vercel.app',
    'https://www.ipldata.in'
  ]);
}).on('error', (error: any) => {
  console.error('Server error:', error);
  process.exit(1);
}); 