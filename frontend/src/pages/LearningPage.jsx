import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../api/courseApi';
import { getCourseProgress, markLectureComplete } from '../api/enrollmentApi';
import { FiCheckCircle, FiCircle, FiArrowLeft, FiBook, FiChevronRight, FiPlay, FiClock, FiLayers, FiMaximize } from 'react-icons/fi';

const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        getCourseById(courseId),
        getCourseProgress(courseId)
      ]);

      const courseData = courseRes.data.course;
      const enrollmentData = progressRes.data.enrollment;

      setCourse(courseData);
      setEnrollment(enrollmentData);

      if (!selectedLecture && courseData.sections?.length > 0) {
        const firstSection = courseData.sections[0];
        if (firstSection.lectures?.length > 0) {
          setSelectedLecture(firstSection.lectures[0]);
        }
      } else if (selectedLecture) {
        const updatedLecture = courseData.sections
          .flatMap(s => s.lectures)
          .find(l => l._id === selectedLecture._id);
        if (updatedLecture) setSelectedLecture(updatedLecture);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      await markLectureComplete(enrollment._id, lectureId);
      fetchCourseData();
    } catch (error) {
      console.error('Error marking lecture complete:', error);
    }
  };

  const isLectureCompleted = (lectureId) => {
    return enrollment?.completedLectures?.some(id => id === lectureId);
  };

  const renderVideoPlayer = (url) => {
    if (!url) return null;

    // Force HTTPS
    let secureUrl = url.replace('http://', 'https://');

    // Detect if it's a direct video link or a Cloudinary video
    const isCloudinaryVideo = secureUrl.includes('cloudinary.com') && secureUrl.includes('/video/upload');
    const isDirectLink = secureUrl.match(/\.(mp4|m4v|webm|ogv|mov|m4a|3gp|flv)$/i) || isCloudinaryVideo;

    if (isDirectLink) {
      // For Cloudinary videos, we can ensure they are delivered optimally
      let finalUrl = secureUrl;
      if (isCloudinaryVideo) {
        // We can insert f_auto,q_auto transformations for better delivery if not already transformed
        if (!secureUrl.includes('/f_auto')) {
          finalUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        // Always ensure an mp4 extension for the video tag's primary source
        if (!finalUrl.endsWith('.mp4')) {
          finalUrl = finalUrl.includes('?') ? finalUrl.replace('?', '.mp4?') : `${finalUrl}.mp4`;
        }
      }

      return (
        <video
          controls
          className="w-full h-full rounded-[2.5rem] bg-black shadow-2xl"
          key={finalUrl}
          playsInline
          crossOrigin="anonymous"
          preload="metadata"
        >
          <source src={finalUrl} type="video/mp4" />
          <source src={secureUrl} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Default to iframe for YouTube/Vimeo/Embeds
    // Check if it's a youtube link and convert to embed if needed
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
    }

    return (
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-[2.5rem]"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Course Content"
      ></iframe>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-surface-400 font-bold animate-pulse">Entering Cinema Mode...</p>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) return null;

  return (
    <div className="h-screen bg-surface-950 flex flex-col pt-16 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-surface-900 border-b border-surface-800 px-6 py-4 z-20">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/student/dashboard"
              className="flex items-center text-surface-400 hover:text-white transition-colors group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-surface-800" />
            <h1 className="text-white font-bold text-lg hidden md:block italic truncate max-w-md">{course.title}</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block w-32 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <span className="text-primary-500 font-black text-xs uppercase tracking-widest">{enrollment.progress}% Complete</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-surface-800 p-2.5 rounded-xl text-white hover:bg-surface-700 transition-all border border-surface-700"
            >
              {isSidebarOpen ? <FiChevronRight className="rotate-0 transition-transform" /> : <FiLayers />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Cinema Video Area */}
        <div className="flex-1 relative flex flex-col bg-black overflow-y-auto scrollbar-none">
          <div className="flex-1 flex items-center justify-center bg-black/40 p-4 lg:p-12">
            <div className="w-full max-w-[1280px] aspect-video bg-surface-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5">
              {selectedLecture ? (
                renderVideoPlayer(selectedLecture.videoUrl)
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <FiPlay className="text-7xl text-surface-800" />
                  <p className="text-surface-500 font-bold italic">Ready to learn? Select a unit from the sidebar.</p>
                </div>
              )}
            </div>
          </div>

          {/* Lecture Info Footer */}
          <div className="bg-surface-900/50 border-t border-surface-800 px-8 py-10 lg:px-20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-1">
                <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4 block animate-fade-in">Unit Currently Playing</span>
                <h2 className="text-3xl font-bold text-white mb-6 font-heading leading-tight tracking-tight">{selectedLecture?.title}</h2>
                <div className="flex flex-wrap gap-6 items-center text-surface-400 text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center"><FiClock className="mr-2 text-primary-500" /> {Math.floor(selectedLecture?.duration / 60)}m {selectedLecture?.duration % 60}s</span>
                  <span className="flex items-center"><FiCheckCircle className="mr-2 text-primary-500" /> High-Definition Playback</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => handleMarkComplete(selectedLecture._id)}
                  disabled={isLectureCompleted(selectedLecture._id)}
                  className={`px-10 py-4 rounded-[1.5rem] font-bold transition-all flex items-center space-x-3 shadow-xl ${isLectureCompleted(selectedLecture._id)
                    ? 'bg-green-600/10 text-green-400 border-2 border-green-600/20 cursor-default'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-600/20'
                    }`}
                >
                  {isLectureCompleted(selectedLecture._id) ? <FiCheckCircle /> : <FiPlay />}
                  <span>{isLectureCompleted(selectedLecture._id) ? 'Unit Perfected' : 'Master Unit & Continue'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Syllabus Sidebar */}
        <div
          className={`bg-surface-900 border-l border-surface-800 transition-all duration-500 ease-in-out overflow-y-auto scrollbar-none flex flex-col shadow-2xl z-10 ${isSidebarOpen ? 'w-full lg:w-[420px]' : 'w-0'
            }`}
        >
          <div className="p-8 border-b border-surface-800 flex items-center justify-between sticky top-0 bg-surface-900 z-30">
            <h3 className="text-white font-bold text-xl font-heading tracking-tight">Syllabus Explorer</h3>
            <div className="bg-primary-600/10 text-primary-500 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase">
              Curriculum
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-6">
            {course.sections?.map((section, sIdx) => (
              <div key={section._id} className="space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-xs font-bold text-surface-400 border border-surface-700">
                    {sIdx + 1}
                  </div>
                  <h4 className="text-surface-300 font-bold text-xs uppercase tracking-widest truncate">
                    {section.title}
                  </h4>
                </div>

                <div className="space-y-2">
                  {section.lectures?.map((lecture, lIdx) => {
                    const isCurrent = selectedLecture?._id === lecture._id;
                    const isDone = isLectureCompleted(lecture._id);

                    return (
                      <button
                        key={lecture._id}
                        onClick={() => setSelectedLecture(lecture)}
                        className={`w-full group text-left px-5 py-4 rounded-2xl transition-all border-2 relative overflow-hidden ${isCurrent
                          ? 'bg-white/5 border-primary-500/50 shadow-lg shadow-black/20'
                          : 'bg-transparent border-transparent hover:bg-surface-800 hover:border-surface-700'
                          }`}
                      >
                        {isCurrent && <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />}
                        <div className="flex items-center space-x-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isDone ? 'bg-green-500 border-green-500' : isCurrent ? 'border-primary-500' : 'border-surface-700 group-hover:border-surface-500'
                            }`}>
                            {isDone && <FiCheckCircle className="text-white text-xs" />}
                            {isCurrent && !isDone && <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${isCurrent ? 'text-white' : 'text-surface-400'}`}>
                              {lIdx + 1}. {lecture.title}
                            </p>
                            <div className="flex items-center space-x-3 mt-1.5">
                              <span className="text-[10px] font-bold text-surface-600 uppercase tracking-tighter flex items-center">
                                <FiClock className="mr-1" /> {Math.floor(lecture.duration / 60)}:{(lecture.duration % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
