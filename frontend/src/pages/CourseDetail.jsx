import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../api/courseApi';
import { enrollInCourse, checkEnrollment, createPaymentOrder, verifyPayment } from '../api/enrollmentApi';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiUser, FiClock, FiVideo, FiCheckCircle, FiArrowLeft, FiStar, FiFileText, FiShare2, FiHeart } from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated && isStudent) {
      checkIfEnrolled();
    }
  }, [id, isAuthenticated, isStudent]);

  const fetchCourse = async () => {
    try {
      const response = await getCourseById(id);
      setCourse(response.data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfEnrolled = async () => {
    try {
      const response = await checkEnrollment(id);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      alert('Only students can enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      if (course.price === 0) {
        // Free enrollment
        await enrollInCourse(id);
        setIsEnrolled(true);
        navigate('/student/dashboard');
      } else {
        // Paid enrollment via Razorpay
        const orderRes = await createPaymentOrder(id);
        const { order } = orderRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S54XCox6Z3ZcVf',
          amount: order.amount,
          currency: order.currency,
          name: "Coursify",
          description: `Enrollment for ${course.title}`,
          order_id: order.id,
          handler: async (response) => {
            try {
              const verifyRes = await verifyPayment({
                ...response,
                courseId: id
              });
              if (verifyRes.success) {
                setIsEnrolled(true);
                navigate('/student/dashboard');
              }
            } catch (error) {
              alert(error.response?.data?.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: "", // You can get this from auth context if needed
            email: "",
          },
          theme: {
            color: "#4f46e5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const getTotalLectures = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((total, section) => total + (section.lectures?.length || 0), 0);
  };

  const getTotalDuration = () => {
    if (!course?.sections) return 0;
    let total = 0;
    course.sections.forEach(section => {
      section.lectures?.forEach(lecture => {
        total += lecture.duration || 0;
      });
    });
    return Math.floor(total / 60); // Convert to minutes
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <p className="text-surface-500 font-bold animate-pulse">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center bg-white p-12 rounded-[2.5rem] border border-surface-200 shadow-sm max-w-lg mx-auto">
          <FiBook className="text-6xl text-surface-200 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <p className="text-surface-500 mb-8">The course you are looking for doesn't exist or has been removed.</p>
          <Link to="/courses" className="btn-primary px-8 py-3 inline-block">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-20">
      {/* Hero Banner */}
      <div className="bg-surface-900 border-b border-surface-800 relative py-16 md:py-24 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600 opacity-20 blur-[150px] rounded-full translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-secondary-600 opacity-10 blur-[100px] rounded-full -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center text-surface-400 hover:text-white mb-8 transition-colors group bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to courses
          </button>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary-600/20 text-primary-400 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-600/30">
                  {course.category}
                </span>
                <span className="px-4 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 uppercase">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-surface-300 mb-8 max-w-3xl leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-8 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-orange-400/20 p-1.5 rounded-lg">
                    <FiStar className="text-orange-400 fill-current" />
                  </div>
                  <span className="font-bold">4.8 (1,240 ratings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/10 p-1.5 rounded-lg text-surface-400">
                    <FiUser />
                  </div>
                  <span>Created by <span className="text-primary-400 font-bold">{course.instructor?.name}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/10 p-1.5 rounded-lg text-surface-400">
                    <FiClock />
                  </div>
                  <span>Updated Dec 2025</span>
                </div>
              </div>
            </div>

            {/* Sticky Card Overlay (Desktop) */}
            <div className="lg:block hidden sticky top-32 z-20">
              <div className="glass bg-white p-2 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up shadow-primary-900/10 border border-white/50">
                <div className="relative rounded-[2rem] overflow-hidden aspect-video bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiVideo className="text-6xl text-white/50" />
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-3xl font-bold text-surface-900">${course.price ? (course.price).toFixed(2) : '0.00'}</p>
                      <p className={`text-sm font-bold ${course.price > 0 ? 'text-primary-600' : 'text-green-600'}`}>
                        {course.price > 0 ? 'Premium Access' : '100% Free Access'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-3 bg-surface-50 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <FiHeart />
                      </button>
                      <button className="p-3 bg-surface-50 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all">
                        <FiShare2 />
                      </button>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <Link
                      to={`/learn/${id}`}
                      className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center justify-center space-x-2"
                    >
                      <FiPlayCircle className="text-xl" />
                      <span>Resume Learning</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
                    </button>
                  )}

                  <p className="text-center text-xs text-surface-400 mt-6 font-medium tracking-wide font-bold">MONEY BACK GUARANTEE • 30 DAYS</p>

                  <div className="mt-8 pt-8 border-t border-surface-100 space-y-4">
                    <h4 className="font-bold text-surface-900 mb-2">This course includes:</h4>
                    <div className="flex items-center space-x-3 text-surface-600 font-medium">
                      <FiVideo className="text-primary-600" />
                      <span>{getTotalDuration()} hours on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-3 text-surface-600 font-medium">
                      <FiFileText className="text-primary-600" />
                      <span>{getTotalLectures()} downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3 text-surface-600 font-medium">
                      <FiCheckCircle className="text-primary-600" />
                      <span>Full lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* What you'll learn */}
            <div className="bg-white rounded-[3rem] p-12 border border-surface-100 shadow-sm">
              <h2 className="text-3xl font-bold mb-8">What you will <span className="text-gradient">learn</span></h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <FiCheckCircle className="text-primary-600 mt-1 flex-shrink-0" />
                    <p className="text-surface-600 font-medium">Master the core concepts and advanced techniques needed to succeed.</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-3xl font-bold italic">Curriculum</h2>
                <span className="text-surface-500 font-bold">{course.sections?.length || 0} Sections • {getTotalLectures()} Lectures</span>
              </div>
              <div className="space-y-4">
                {course.sections?.map((section, idx) => (
                  <div key={section._id} className="bg-white rounded-3xl border border-surface-100 overflow-hidden shadow-sm group">
                    <div className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-surface-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center font-bold text-surface-500">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{section.title}</h3>
                          <p className="text-xs text-surface-400 font-bold">{section.lectures?.length || 0} Lectures</p>
                        </div>
                      </div>
                      <FiChevronRight className="text-surface-400 group-hover:text-primary-600 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-[3rem] p-12 border border-surface-100 shadow-sm">
              <h2 className="text-3xl font-bold mb-8">About the <span className="text-gradient">Instructor</span></h2>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
                <img
                  src={`https://i.pravatar.cc/150?u=${course.instructor?._id}`}
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-primary-50 shadow-xl"
                  alt="instructor"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-1">{course.instructor?.name}</h3>
                  <p className="text-primary-600 font-bold mb-6 italic">{course.instructor?.role || 'Senior Industry Expert'}</p>
                  <p className="text-surface-600 leading-relaxed font-medium">
                    Passionate educator with over 10 years of experience in the industry. Helping thousands of students master their craft and build successful careers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Enroll Button (Sticky bottom) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-surface-100 z-50">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 shadow-lg shadow-primary-100"
            >
              {enrolling ? 'Enrolling...' : 'Enroll in course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple helper icon
const FiPlayCircle = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
)

const FiChevronRight = ({ className }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
)

export default CourseDetail;
