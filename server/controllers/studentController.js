const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Admin)
exports.createStudent = async (req, res, next) => {
  try {
    const { studentId, email } = req.body;
    
    const existingStudent = await Student.findOne({ $or: [{ studentId }, { email }] });
    if (existingStudent) {
      res.status(400).json({
        message : "Student with ID or Email already exists"
      })
      return;
    }

    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students (with Pagination, Search, Filter)
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status, sort } = req.query;

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort ? { [sort]: 1 } : { createdAt: -1 });

    const count = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalStudents: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.json(student);
    } else {
      res.status(404);
      throw new Error('Student not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }
    
    res.json({ message: 'Student removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/students/stats/overview
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const totalUsers = await User.countDocuments();
    
    // Get unique course count
    const uniqueCourses = await Student.distinct('course');
    const activeCourses = uniqueCourses.length || 0; 
    
    const recentEnrollments = await Student.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalStudents,
      activeStudents,
      totalUsers,
      activeCourses,
      recentEnrollments,
      capacityPercentage: (totalStudents + totalUsers) > 0 ? Math.min(100, Math.round(((totalStudents + totalUsers) / 1000) * 100)) : 0 
    });
  } catch (error) {
    next(error);
  }
};
