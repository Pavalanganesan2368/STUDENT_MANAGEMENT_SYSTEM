const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

const validateRegister = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({  message: errors.array()[0].msg });
        }
        next();
    }
];

const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
]

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
