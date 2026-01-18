import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyCourses } from '../api/courseApi';
import { FiBook, FiPlus, FiUsers, FiEdit, FiEye, FiTrendingUp, FiActivity, FiChevronRight, FiGrid, FiList } from 'react-icons/fi';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getMyCourses();
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-surface-100 text-surface-600',
      published: 'bg-green-100 text-green-700',
      unpublished: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-black/5 ${styles[status] || styles.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold text-surface-900 mb-2 font-heading tracking-tight">
              Commander Dashboard
            </h1>
            <p className="text-surface-500 font-medium">Welcome back, <span className="text-primary-600 font-bold">{user?.name}</span>. Here is your teaching overview.</p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="group inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all animate-fade-in"
          >
            <FiPlus className="text-xl" />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in">
          {[
            { label: 'Total Courses', value: courses.length, icon: FiBook, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Total Students', value: courses.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0), icon: FiUsers, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Avg. Rating', value: '4.8', icon: FiTrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Published', value: courses.filter(c => c.status === 'published').length, icon: FiEye, color: 'text-green-500', bg: 'bg-green-50' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-surface-100 shadow-sm card-hover">
              <div className="flex items-center justify-between mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon className="text-2xl" />
                </div>
              </div>
              <p className="text-surface-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-surface-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Course List Section */}
        <div className="bg-white rounded-[3rem] border border-surface-100 shadow-sm overflow-hidden animate-slide-up">
          <div className="px-10 py-8 border-b border-surface-50 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-heading">My Course Portfolio</h2>
            <div className="flex bg-surface-50 p-1 rounded-xl">
              <button className="p-2 bg-white rounded-lg shadow-sm text-primary-600"><FiGrid /></button>
              <button className="p-2 text-surface-400 hover:text-surface-600"><FiList /></button>
            </div>
          </div>

          <div className="p-4 sm:p-10">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-surface-400 font-bold">Retrieving your content...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-surface-50/50 rounded-[2.5rem] border-2 border-dashed border-surface-200">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <FiActivity className="text-4xl text-surface-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-surface-900">Your portfolio is empty</h3>
                <p className="text-surface-500 max-w-sm mx-auto mb-8 font-medium">Ready to share your knowledge? Start by creating your very first high-impact course.</p>
                <Link to="/instructor/courses/create" className="text-primary-600 font-bold flex items-center justify-center hover:underline">
                  Get started now <FiChevronRight className="ml-1" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="group flex flex-col md:flex-row items-center bg-surface-50/30 rounded-3xl p-6 border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-xl hover:shadow-primary-600/5 transition-all">
                    {/* Course Mini Thumbnail */}
                    <div className="w-full md:w-32 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0 overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FiBook className="text-4xl text-white/50" />
                      )}
                    </div>

                    <div className="flex-grow text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <h3 className="text-xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-surface-500 text-sm mb-4 line-clamp-1 max-w-xl font-medium">{course.description}</p>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-surface-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center"><FiUsers className="mr-1.5" /> {course.totalEnrollments || 0} Students</span>
                        <span className="flex items-center"><FiGrid className="mr-1.5" /> {course.sections?.length || 0} Sections</span>
                        <span className="text-primary-600">{course.category}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6 md:mt-0 md:ml-8">
                      <Link
                        to={`/instructor/courses/${course._id}/build`}
                        className="p-4 bg-white border border-surface-100 text-surface-600 hover:text-primary-600 hover:border-primary-600 rounded-2xl shadow-sm transition-all"
                        title="Edit Course"
                      >
                        <FiEdit className="text-xl" />
                      </Link>
                      <Link
                        to={`/courses/${course._id}`}
                        className="p-4 bg-white border border-surface-100 text-surface-600 hover:text-primary-600 hover:border-primary-600 rounded-2xl shadow-sm transition-all"
                        title="View Course"
                      >
                        <FiEye className="text-xl" />
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

export default InstructorDashboard;
