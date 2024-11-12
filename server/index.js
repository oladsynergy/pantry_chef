import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'ahmedadesoga2@gmail.com',
    pass: 'fkigjhcjygbsgsfn'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Feedback route
app.post('/api/feedback', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'Missing required fields' 
    });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'oladsynergysolutions@gmail.com',
      replyTo: email,
      subject: `Pantry Chef Feedback: ${subject}`,
      html: `
        <h2>New Feedback from Pantry Chef</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send feedback', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Feedback endpoint: http://localhost:${PORT}/api/feedback`);
});