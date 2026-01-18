import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById, addSection, addLecture, publishCourse, deleteSection, deleteLecture } from '../api/courseApi';
import { uploadVideo } from '../api/uploadApi';
import { FiPlus, FiEdit, FiTrash2, FiVideo, FiCheckCircle, FiArrowLeft, FiBook, FiChevronDown, FiChevronUp, FiMoreVertical, FiPlayCircle, FiClock, FiLayout, FiUploadCloud, FiX, FiLink } from 'react-icons/fi';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await getCourseById(courseId);
      setCourse(response.data.course);
      const initialExpanded = {};
      response.data.course.sections?.forEach(s => initialExpanded[s._id] = true);
      setExpandedSections(initialExpanded);
    } catch (err) {
      setError('Could not load course builder. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSection = () => {
    setSelectedSection(null);
    setShowSectionModal(true);
  };

  const handleAddLecture = (sectionId) => {
    setSelectedSection(sectionId);
    setShowLectureModal(true);
  };

  const handlePublish = async () => {
    if (!course.sections || course.sections.length === 0) {
      alert('Your course needs at least one section before publishing.');
      return;
    }
    const hasLectures = course.sections.some(s => s.lectures?.length > 0);
    if (!hasLectures) {
      alert('Add at least one lecture unit before going live.');
      return;
    }

    if (window.confirm('Ready to go live? This will make your course available to all students.')) {
      try {
        await publishCourse(courseId);
        fetchCourse();
      } catch (err) {
        alert('Publication failed. Internal server error.');
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Permanently remove this section and its contents?')) {
      try {
        await deleteSection(courseId, sectionId);
        fetchCourse();
      } catch (err) {
        alert('Failed to remove section.');
      }
    }
  };

  const handleDeleteLecture = async (sectionId, lectureId) => {
    if (window.confirm('Remove this lecture unit?')) {
      try {
        await deleteLecture(courseId, sectionId, lectureId);
        fetchCourse();
      } catch (err) {
        alert('Failed to remove lecture.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <p className="text-surface-500 font-bold animate-pulse">Initializing Builder Workspace...</p>
        </div>
      </div>
    );
  }

  const sections = Array.isArray(course?.sections) ? course.sections : [];

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 animate-fade-in">
          <div className="flex-1">
            <Link to="/instructor/dashboard" className="inline-flex items-center text-surface-400 hover:text-primary-600 font-bold mb-4 transition-colors group">
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Command Center
            </Link>
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-100">
                <FiLayout className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-surface-900 font-heading">{course.title}</h1>
                <p className="text-surface-500 font-medium italic mt-1">{course.category} • {course.level}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <button
              onClick={handlePublish}
              disabled={course.status === 'published'}
              className={`flex-grow lg:flex-grow-0 inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all ${course.status === 'published'
                  ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-xl shadow-primary-100'
                }`}
            >
              {course.status === 'published' ? <FiCheckCircle /> : <FiPlus />}
              <span>{course.status === 'published' ? 'Live on Platform' : 'Publish Course'}</span>
            </button>
          </div>
        </div>

        {/* Builder Area */}
        <div className="bg-white rounded-[3rem] border border-surface-100 shadow-sm overflow-hidden animate-slide-up">
          <div className="px-10 py-8 border-b border-surface-50 flex items-center justify-between bg-surface-50/30">
            <h2 className="text-2xl font-bold font-heading">Course Curriculum</h2>
            <button
              onClick={handleAddSection}
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-bold border-2 border-primary-50 hover:border-primary-600 transition-all shadow-sm"
            >
              <FiPlus />
              <span>New Section</span>
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {sections.length === 0 ? (
              <div className="text-center py-24 bg-surface-50/50 rounded-[2.5rem] border-2 border-dashed border-surface-200">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <FiBook className="text-5xl text-surface-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Start Building Your Knowledge</h3>
                <p className="text-surface-500 max-w-sm mx-auto mb-10 font-medium">Divide your course into logical sections and fill them with engaging video lectures.</p>
                <button onClick={handleAddSection} className="btn-primary w-fit mx-auto px-10">
                  Create First Section
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {sections.map((section, idx) => (
                  <div key={section._id} className="border-2 border-surface-100 rounded-3xl overflow-hidden group">
                    {/* Section Header */}
                    <div className="px-8 py-6 bg-surface-50/50 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleSection(section._id)}
                          className="p-2 hover:bg-white rounded-xl text-surface-400 hover:text-primary-600 transition-all"
                        >
                          {expandedSections[section._id] ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        <div className="font-bold text-surface-300 tracking-widest uppercase text-xs">Section {idx + 1}</div>
                        <h3 className="text-lg font-bold text-surface-900">{section.title}</h3>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleAddLecture(section._id)}
                          className="px-4 py-2 bg-white text-primary-600 text-sm font-bold border border-primary-100 rounded-xl hover:shadow-md transition-all flex items-center space-x-1"
                        >
                          <FiPlus />
                          <span>Unit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section._id)}
                          className="p-3 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Lectures Container */}
                    {expandedSections[section._id] && (
                      <div className="px-8 py-4 bg-white animate-fade-in">
                        {section.lectures?.length > 0 ? (
                          <div className="space-y-3 pb-4">
                            {section.lectures.map((lecture, lIdx) => (
                              <div key={lecture._id} className="group/lecture flex items-center bg-surface-50/50 p-4 rounded-2xl hover:bg-white border-2 border-transparent hover:border-primary-100 hover:shadow-lg hover:shadow-primary-600/5 transition-all">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-surface-400 mr-4 shadow-sm">
                                  {lIdx + 1}
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-bold text-surface-800 flex items-center">
                                    <FiPlayCircle className="mr-2 text-primary-600" />
                                    {lecture.title}
                                  </h4>
                                  <div className="flex items-center space-x-4 mt-1">
                                    <span className="text-[10px] uppercase font-black text-surface-400 tracking-tighter flex items-center">
                                      <FiClock className="mr-1" />
                                      {Math.floor(lecture.duration / 60)}:{String(lecture.duration % 60).padStart(2, '0')} min
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleDeleteLecture(section._id, lecture._id)}
                                    className="p-2 text-surface-300 hover:text-red-500 rounded-lg transition-all"
                                  >
                                    <FiTrash2 />
                                  </button>
                                  <button className="p-2 text-surface-300 hover:text-surface-600 rounded-lg cursor-grab">
                                    <FiMoreVertical />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 flex flex-col items-center border-2 border-dashed border-surface-100 rounded-[2rem] bg-surface-50/30 mb-4">
                            <FiVideo className="text-3xl text-surface-200 mb-4" />
                            <p className="text-surface-400 font-bold text-sm mb-4">No content here yet.</p>
                            <button onClick={() => handleAddLecture(section._id)} className="text-primary-600 font-bold text-xs uppercase tracking-widest hover:underline">+ Add Content</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSectionModal && (
        <SectionModal
          courseId={courseId}
          onClose={() => setShowSectionModal(false)}
          onSuccess={() => { fetchCourse(); setShowSectionModal(false); }}
        />
      )}

      {showLectureModal && selectedSection && (
        <LectureModal
          courseId={courseId}
          sectionId={selectedSection}
          onClose={() => { setShowLectureModal(false); setSelectedSection(null); }}
          onSuccess={() => { fetchCourse(); setShowLectureModal(false); setSelectedSection(null); }}
        />
      )}
    </div>
  );
};

// --- Modals ---

const SectionModal = ({ courseId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addSection(courseId, { title: title.trim(), order: 1 });
      onSuccess();
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-white/50">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold italic">New Section</h3>
            <button onClick={onClose} className="p-2 hover:bg-surface-50 rounded-xl text-surface-400 transition-all rotate-45"><FiPlus className="text-2xl" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-surface-400 uppercase tracking-widest mb-4">Section Identity</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master the Foundations"
                className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold text-lg"
                autoFocus
              />
            </div>
            <div className="flex justify-end pt-4 gap-4">
              <button type="button" onClick={onClose} className="px-6 py-4 text-surface-400 font-bold hover:text-surface-600 transition-all" disabled={loading}>Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto" /> : 'Confirm Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LectureModal = ({ courseId, sectionId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ title: '', videoUrl: '', duration: 0, publicId: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' or 'link'

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      setFormData({
        ...formData,
        videoUrl: response.data.url,
        publicId: response.data.publicId,
        duration: Math.round(response.data.duration || 0)
      });
    } catch (err) {
      alert('Failed to upload video. Check file size and format.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.videoUrl.trim()) return;

    setLoading(true);
    try {
      await addLecture(courseId, sectionId, {
        title: formData.title.trim(),
        videoUrl: formData.videoUrl.trim(),
        duration: formData.duration,
        publicId: formData.publicId || `v-${Date.now()}`,
        order: 1
      });
      onSuccess();
    } catch (err) {
      setLoading(false);
      alert('Failed to add unit. Please check your network.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-white/50">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold italic">Append Content</h3>
            <button onClick={onClose} className="p-2 hover:bg-surface-50 rounded-xl text-surface-400 transition-all rotate-45"><FiPlus className="text-2xl" /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-surface-400 uppercase tracking-widest mb-3">Unit Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Setting up your IDE"
                className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-4 px-6 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold"
                required
              />
            </div>

            <div className="flex bg-surface-50 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${mode === 'upload' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
              >
                Upload Video
              </button>
              <button
                type="button"
                onClick={() => setMode('link')}
                className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${mode === 'link' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-400'}`}
              >
                External Link
              </button>
            </div>

            {mode === 'upload' ? (
              <div>
                <label className="block text-sm font-bold text-surface-400 uppercase tracking-widest mb-3">Video File</label>
                {formData.videoUrl ? (
                  <div className="flex items-center justify-between bg-green-50 p-4 rounded-2xl border-2 border-green-100">
                    <div className="flex items-center space-x-3">
                      <FiCheckCircle className="text-green-600" />
                      <span className="text-sm font-bold text-green-700">Video Uploaded!</span>
                    </div>
                    <button type="button" onClick={() => setFormData({ ...formData, videoUrl: '' })} className="text-red-500 p-2"><FiX /></button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${uploading ? 'bg-primary-50/10 border-primary-200' : 'border-surface-200 hover:border-primary-400'}`}>
                      {uploading ? (
                        <div className="w-full">
                          <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-[10px] font-black uppercase text-primary-600 tracking-widest text-center">{uploadProgress}% Uploading</p>
                        </div>
                      ) : (
                        <>
                          <FiUploadCloud className="text-3xl text-surface-200 mb-2" />
                          <span className="text-xs font-bold text-surface-400 tracking-tighter uppercase">Click to Select MP4/MOV</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-surface-400 uppercase tracking-widest mb-3">Direct URL</label>
                <div className="relative group">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="Youtube, Vimeo, or direct mp4"
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-4 pl-12 pr-6 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6 gap-4">
              <button type="button" onClick={onClose} className="px-6 py-4 text-surface-400 font-bold hover:text-surface-600 transition-all" disabled={loading || uploading}>Discard</button>
              <button type="submit" disabled={loading || uploading || !formData.videoUrl} className="btn-primary min-w-[140px] disabled:opacity-50">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto" /> : 'Append Unit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;
