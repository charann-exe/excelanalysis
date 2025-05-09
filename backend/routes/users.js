const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user upload history (admin only)
router.get('/:userId/history', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, 'uploadHistory');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.uploadHistory);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add upload history (protected route)
router.post('/upload', auth, async (req, res) => {
    try {
        const { fileName, analysisResult } = req.body;
        
        const user = await User.findById(req.user._id);
        user.uploadHistory.push({
            fileName,
            analysisResult
        });
        
        await user.save();
        res.status(201).json(user.uploadHistory);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new user (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a user (admin only)
router.delete('/:userId', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 