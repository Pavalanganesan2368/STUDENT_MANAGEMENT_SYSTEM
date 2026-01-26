const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDashboardStats
} = require('../controllers/studentController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

// Validation Middleware for creating/updating student
const validateStudent = [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('status', 'Status is invalid').optional().isIn(['Active', 'Inactive', 'On Leave']),
    check('progress', 'Progress must be between 0 and 100').optional().isInt({ min: 0, max: 100 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

router.route('/')
  .get(protect, getStudents)
  .post(protect, admin, validateStudent, createStudent);

router.get('/stats/overview', protect, getDashboardStats);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, admin, validateStudent, updateStudent)
  .delete(protect, admin, deleteStudent);

module.exports = router;
