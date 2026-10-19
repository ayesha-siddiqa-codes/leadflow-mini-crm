const express = require('express');
const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all lead endpoints
router.use(authenticateToken);

// GET all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one lead by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a lead
router.post('/', async (req, res) => {
  try {
    const { name, email, company, status, notes, followUpDate } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: 'Name and email are required',
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company,
      status,
      notes,
      followUpDate: followUpDate || null,
    });

    res.status(201).json(lead);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'A lead with this email already exists',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

// UPDATE a lead
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }

    const allowedFields = [
      'name',
      'email',
      'company',
      'status',
      'notes',
      'followUpDate',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
});

// DELETE a lead
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid lead ID' });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;