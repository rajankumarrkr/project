import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyEnrolledCourses } from '../api/enrollmentApi';
import { FiBook, FiClock, FiAward, FiPlay, FiTrendingUp, FiCheckCircle, FiChevronRight, FiGrid, FiActivity } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await getMyEnrolledCourses();
      setEnrollments(response.data.enrollments);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.progress === 100).length;
    const totalHours = enrollments.reduce((sum, e) => {
      const sections = e.course?.sections || [];
      const totalSeconds = sections.reduce((sectionSum, section) => {
        const lectures = section.lectures || [];
        return sectionSum + lectures.reduce((lectureSum, lecture) => lectureSum + (lecture.duration || 0), 0);
      }, 0);
      return sum + (totalSeconds / 3600);
    }, 0);

    return { totalCourses, completedCourses, totalHours: Math.round(totalHours * 10) / 10 };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold text-surface-900 mb-2 font-heading tracking-tight">
              Learning Command
            </h1>
            <p className="text-surface-500 font-medium">Keep growing, <span className="text-primary-600 font-bold">{user?.name}</span>. You're doing great!</p>
          </div>
          <div className="hidden lg:flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl border border-surface-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FiActivity />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-surface-400">Current Streak</p>
              <p className="text-sm font-bold text-surface-900">12 Days 🔥</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-fade-in">
          {[
            { label: 'Enrolled', value: stats.totalCourses, icon: FiBook, color: 'text-primary-600', bg: 'bg-primary-50' },
            { label: 'Hours Spent', value: stats.totalHours, icon: FiClock, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Completed', value: stats.completedCourses, icon: FiAward, color: 'text-green-500', bg: 'bg-green-50' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-surface-100 shadow-sm card-hover overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-surface-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                    <stat.icon className="text-2xl" />
                  </div>
                </div>
                <p className="text-surface-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-surface-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* My Courses Section */}
        <div className="bg-white rounded-[3rem] border border-surface-100 shadow-sm overflow-hidden animate-slide-up">
          <div className="px-10 py-8 border-b border-surface-50 flex items-center justify-between bg-surface-50/20">
            <h2 className="text-2xl font-bold font-heading">My Course Library</h2>
            <div className="flex bg-surface-100/50 p-1 rounded-xl">
              <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-primary-600">Active</button>
              <button className="px-4 py-2 text-sm font-bold text-surface-400 hover:text-surface-600 transition-colors">Completed</button>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="h-48 bg-surface-100 rounded-3xl" />
                    <div className="h-6 bg-surface-100 rounded-lg w-3/4" />
                    <div className="h-4 bg-surface-100 rounded-lg w-1/2" />
                  </div>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-20 bg-surface-50/50 rounded-[2.5rem] border-2 border-dashed border-surface-200">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-surface-100">
                  <FiBook className="text-4xl text-surface-200" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-surface-900">Your library is empty</h3>
                <p className="text-surface-500 max-w-sm mx-auto mb-10 font-medium">Ready to master a new skill? Explore thousands of top-rated courses from experts worldwide.</p>
                <Link to="/courses" className="btn-primary w-fit mx-auto px-10">
                  Discover Courses
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="group bg-surface-50/30 rounded-[2.5rem] border border-transparent hover:border-primary-100 hover:bg-white transition-all card-hover overflow-hidden">
                    <div className="relative p-3">
                      <div className="w-full h-44 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                        {enrollment.course?.thumbnail ? (
                          <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <FiPlay className="text-5xl text-white/50 group-hover:scale-110 transition-transform" />
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-lg border border-white/30 tracking-wider">
                            {enrollment.course?.category}
                          </span>
                        </div>
                        {enrollment.progress === 100 && (
                          <div className="absolute bottom-4 right-4 bg-green-500 p-2 rounded-xl text-white shadow-lg">
                            <FiCheckCircle className="text-xl" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-8 pt-4">
                      <h3 className="text-xl font-bold text-surface-900 mb-6 line-clamp-1 group-hover:text-primary-600 transition-colors">{enrollment.course?.title}</h3>

                      {/* Modern Progress Treatment */}
                      <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                          <p className="text-[10px] font-black uppercase text-surface-400 tracking-widest">Progress</p>
                          <p className="text-sm font-black text-primary-600">{enrollment.progress}%</p>
                        </div>
                        <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 rounded-full transition-all duration-1000 shadow-sm shadow-primary-200"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        to={`/learn/${enrollment.course?._id}`}
                        className="w-full inline-flex items-center justify-center space-x-2 py-4 bg-white border-2 border-surface-100 rounded-2xl font-bold text-surface-700 hover:border-primary-600 hover:text-primary-600 hover:shadow-lg hover:shadow-primary-100 transition-all"
                      >
                        <span>{enrollment.progress === 100 ? 'Review Course' : enrollment.progress > 0 ? 'Resume Learning' : 'Start Learning'}</span>
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
