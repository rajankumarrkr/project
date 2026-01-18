import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../api/courseApi';
import { FiSearch, FiBook, FiUser, FiClock, FiStar, FiChevronRight, FiFilter } from 'react-icons/fi';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Business',
    'Marketing',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, [search, selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;

      const response = await getAllCourses(params);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <span className="text-primary-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Catalog</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our <span className="text-gradient">Courses</span></h1>
          <p className="text-surface-500 font-medium max-w-2xl">
            Choose from thousands of expert-led courses and start your learning journey today.
          </p>
        </div>

        {/* Filters Top Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Search */}
          <div className="relative flex-grow">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
            <input
              type="text"
              placeholder="Search courses, skills, or mentors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-surface-200 rounded-2xl py-4 pl-14 pr-4 focus:border-primary-500 focus:ring-0 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex gap-4">
            <div className="relative min-w-[160px]">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white border-2 border-surface-200 rounded-2xl py-4 pl-10 pr-4 appearance-none focus:border-primary-500 focus:outline-none cursor-pointer font-semibold shadow-sm text-surface-700"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="relative min-w-[150px]">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-white border-2 border-surface-200 rounded-2xl py-4 px-4 appearance-none focus:border-primary-500 focus:outline-none cursor-pointer font-semibold shadow-sm text-surface-700"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl} Level</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills (Quick Access) */}
        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.slice(1, 10).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 whitespace-nowrap ${selectedCategory === cat
                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100'
                : 'bg-white border-surface-200 text-surface-600 hover:border-primary-500 hover:text-primary-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 space-y-4 animate-pulse border border-surface-100">
                <div className="w-full h-48 bg-surface-100 rounded-2xl" />
                <div className="h-6 bg-surface-100 rounded-full w-3/4" />
                <div className="h-4 bg-surface-100 rounded-full w-1/2" />
                <div className="flex justify-between pt-4">
                  <div className="h-4 bg-surface-100 rounded-full w-1/4" />
                  <div className="h-4 bg-surface-100 rounded-full w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-surface-200 shadow-sm">
            <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBook className="text-5xl text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No courses found matching "{search}"</h3>
            <p className="text-surface-500 max-w-sm mx-auto mb-8">Try adjusting your filters or search keywords to find what you're looking for.</p>
            <button onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedLevel('All'); }} className="text-primary-600 font-bold hover:underline">Clear all filters</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 px-2">
              <p className="font-bold text-surface-900">
                Showing <span className="text-primary-600">{courses.length}</span> Results
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group bg-white rounded-[2.5rem] border border-surface-100 overflow-hidden card-hover shadow-sm"
                >
                  {/* Thumbnail Wrapper */}
                  <div className="relative p-3">
                    <div className="w-full h-52 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <FiBook className="text-7xl text-white/50 group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className="absolute top-6 left-6 flex space-x-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-lg border border-white/30">
                          {course.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 pt-2">
                    <div className="flex items-center space-x-1 text-orange-400 mb-3">
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <FiStar className="fill-current" />
                      <span className="text-surface-400 text-xs font-bold ml-1">(4.8)</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                    <p className="text-surface-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.description}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-surface-50">
                      <div className="flex items-center space-x-3">
                        <img src={`https://i.pravatar.cc/150?u=${course.instructor?._id}`} className="w-8 h-8 rounded-lg" alt="instructor" />
                        <span className="text-sm font-bold text-surface-900">{course.instructor?.name || 'Instructor'}</span>
                      </div>
                      <div className="flex items-center text-primary-600 font-bold group">
                        <span className="text-sm">Enroll</span>
                        <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
