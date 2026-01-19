import axios from './axios';

// Enrollment APIs
export const enrollInCourse = async (courseId) => {
  const response = await axios.post(`/enrollments/${courseId}`);
  return response.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await axios.get('/enrollments/my-courses');
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const response = await axios.get(`/enrollments/${courseId}/progress`);
  return response.data;
};

export const checkEnrollment = async (courseId) => {
  const response = await axios.get(`/enrollments/${courseId}/check`);
  return response.data;
};

// Progress APIs
export const markLectureComplete = async (enrollmentId, lectureId) => {
  const response = await axios.post('/progress/mark-complete', {
    enrollmentId,
    lectureId
  });
  return response.data;
};

export const markLectureIncomplete = async (enrollmentId, lectureId) => {
  const response = await axios.post('/progress/mark-incomplete', {
    enrollmentId,
    lectureId
  });
  return response.data;
};

export const getEnrollmentProgress = async (enrollmentId) => {
  const response = await axios.get(`/progress/${enrollmentId}`);
  return response.data;
};

// Razorpay Payment APIs
export const createPaymentOrder = async (courseId) => {
  const response = await axios.post(`/enrollments/create-order/${courseId}`);
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await axios.post('/enrollments/verify-payment', paymentData);
  return response.data;
};
