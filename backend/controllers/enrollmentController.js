const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student only)
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Check if course exists and is published
    const course = await Course.findById(courseId).populate('sections');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in unpublished course'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // If course is paid, we don't enroll directly
    if (course.price > 0) {
      return res.status(400).json({
        success: false,
        message: 'This is a paid course. Please initiate payment first.'
      });
    }

    // Create enrollment (for free courses)
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLectures: []
    });

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(studentId, {
      $push: { enrolledCourses: courseId }
    });

    // Increment course enrollment count
    course.totalEnrollments += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: { enrollment }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Get all enrolled courses for student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student only)
exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name profileImage'
        }
      })
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: { enrollments }
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses',
      error: error.message
    });
  }
};

// @desc    Get enrollment details with progress
// @route   GET /api/enrollments/:courseId/progress
// @access  Private (Student only)
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    })
      .populate({
        path: 'course',
        populate: [
          {
            path: 'sections',
            populate: {
              path: 'lectures'
            }
          },
          {
            path: 'instructor',
            select: 'name bio profileImage expertise'
          }
        ]
      })
      .populate('completedLectures');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { enrollment }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// @desc    Check if student is enrolled in a course
// @route   GET /api/enrollments/:courseId/check
// @access  Private (Student only)
exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrollment: enrollment || null
      }
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking enrollment',
      error: error.message
    });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/enrollments/create-order/:courseId
// @access  Private (Student only)
exports.createPaymentOrder = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const options = {
      amount: Math.round(course.price * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating payment order' });
  }
};

// @desc    Verify Razorpay Payment and Enroll
// @route   POST /api/enrollments/verify-payment
// @access  Private (Student only)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Payment verified, now enroll the student
    const studentId = req.user._id;

    // Check if already enrolled (to prevent double enrollment)
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(200).json({ success: true, message: 'Already enrolled' });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLectures: []
    });

    await User.findByIdAndUpdate(studentId, { $push: { enrolledCourses: courseId } });

    const course = await Course.findById(courseId);
    course.totalEnrollments += 1;
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and enrolled successfully',
      data: { enrollment }
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};
