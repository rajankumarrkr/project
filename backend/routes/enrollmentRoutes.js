const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrolledCourses,
  getCourseProgress,
  checkEnrollment,
  createPaymentOrder,
  verifyPayment
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are student-only
router.get('/my-courses', protect, authorize('student'), getMyEnrolledCourses);
router.post('/verify-payment', protect, authorize('student'), verifyPayment);
router.post('/create-order/:courseId', protect, authorize('student'), createPaymentOrder);
router.post('/:courseId', protect, authorize('student'), enrollInCourse);
router.get('/:courseId/progress', protect, authorize('student'), getCourseProgress);
router.get('/:courseId/check', protect, authorize('student'), checkEnrollment);

module.exports = router;
