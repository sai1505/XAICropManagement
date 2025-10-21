const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { userExists, addUser, findUserByEmail } = require('../utils/fileStorage');

// Signup Route with Validation
router.post(
    '/signup',
    [
        // Validate name
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),

        // Validate email
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),

        // Validate password
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),

        // Validate confirmPass
        body('confirmPass')
            .notEmpty()
            .withMessage('Please confirm your password')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array().map(err => ({
                        field: err.path,
                        message: err.msg
                    }))
                });
            }

            const { name, email, password } = req.body;

            // Check if user already exists
            if (userExists(email)) {
                return res.status(409).json({
                    success: false,
                    errors: [{
                        field: 'email',
                        message: 'Email already registered'
                    }]
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Prepare user data
            const userData = {
                userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                email,
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            // Save user to file
            const saved = addUser(userData);

            if (!saved) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to save user data'
                });
            }

            // Return success response (don't send password back)
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    userId: userData.userId,
                    name: userData.name,
                    email: userData.email,
                    createdAt: userData.createdAt
                }
            });

        } catch (error) {
            console.error('Signup Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration',
                error: error.message
            });
        }
    }
);

// Login Route
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array().map(err => ({
                        field: err.path,
                        message: err.msg
                    }))
                });
            }

            const { email, password } = req.body;

            // Find user
            const user = findUserByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Compare password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Return success
            res.json({
                success: true,
                message: 'Login successful',
                user: {
                    userId: user.userId,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login',
                error: error.message
            });
        }
    }
);

// Get all users (for testing only - remove in production)
router.get('/users', (req, res) => {
    const { readUsers } = require('../utils/fileStorage');
    const users = readUsers();
    
    // Remove passwords before sending
    const safeUsers = users.map(({ password, ...user }) => user);
    
    res.json({
        success: true,
        count: safeUsers.length,
        users: safeUsers
    });
});

module.exports = router;
