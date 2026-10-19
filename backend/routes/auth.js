
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Prepare a password hash from the admin password in .env
const adminPasswordHash = bcrypt.hashSync(
  process.env.ADMIN_PASSWORD || '',
  12
);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    if (!process.env.JWT_SECRET || !process.env.ADMIN_EMAIL ||
        !process.env.ADMIN_PASSWORD) {
      return res.status(500).json({
        message: 'Authentication is not configured.',
      });
    }

    const emailMatches =
      email.trim().toLowerCase() ===
      process.env.ADMIN_EMAIL.trim().toLowerCase();

    const passwordMatches = await bcrypt.compare(
      password,
      adminPasswordHash
    );

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { role: 'admin', email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      message: 'Unable to log in.',
    });
  }
});

module.exports = router;
