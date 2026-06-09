// server.ts – Express server with API routes
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Placeholder routes (expand based on needs)
app.get('/api', (req, res) => {
  res.json({ message: 'TalentFace API is running' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  res.status(501).json({ message: 'Auth login not implemented yet' });
});

app.post('/api/auth/signup/recruiter', (req, res) => {
  res.status(501).json({ message: 'Recruiter signup not implemented yet' });
});

app.post('/api/auth/signup/joinee', (req, res) => {
  res.status(501).json({ message: 'Joinee signup not implemented yet' });
});

app.post('/api/auth/logout', (req, res) => {
  res.status(501).json({ message: 'Logout not implemented yet' });
});

app.get('/api/auth/me', (req, res) => {
  res.status(501).json({ message: 'Get user not implemented yet' });
});

// Joinee routes
app.get('/api/joinee/profile', (req, res) => {
  res.status(501).json({ message: 'Get joinee profile not implemented yet' });
});

// Admin routes
app.get('/api/admin/stats', (req, res) => {
  res.status(501).json({ message: 'Admin stats not implemented yet' });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();