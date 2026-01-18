import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCourse } from '../api/courseApi';
import { uploadImage } from '../api/uploadApi';
import { FiArrowLeft, FiCheckCircle, FiBookOpen, FiEdit3, FiType, FiLayers, FiBarChart2, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: '',
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'UI/UX Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Other'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const response = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      setFormData({ ...formData, thumbnail: response.data.url });
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeThumbnail = () => {
    setFormData({ ...formData, thumbnail: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setError('Please provide at least a title and a description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createCourse(formData);
      const courseId = response.data.course._id;
      navigate(`/instructor/courses/${courseId}/build`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize your course. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header/Breadcrumbs */}
        <div className="mb-12 animate-fade-in flex items-center justify-between">
          <div>
            <Link
              to="/instructor/dashboard"
              className="inline-flex items-center text-surface-400 hover:text-primary-600 mb-4 font-bold transition-all group"
            >
              <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Command Center
            </Link>
            <h1 className="text-4xl font-bold text-surface-900 font-heading">Draft New Course</h1>
          </div>

          {/* Stepper Mock */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-100">1</div>
              <span className="font-bold text-primary-600">Basics</span>
            </div>
            <div className="w-12 h-0.5 bg-surface-200"></div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-surface-100 text-surface-400 flex items-center justify-center font-bold">2</div>
              <span className="font-bold text-surface-400 font-medium">Builder</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[3rem] border border-surface-100 shadow-sm overflow-hidden animate-slide-up">
          <div className="px-10 py-10">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-10 flex items-center space-x-3">
                <FiBookOpen className="flex-shrink-0" />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Title */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-surface-700 mb-4 pl-1">
                  <FiType className="mr-2 text-primary-600" />
                  How about a catchy title?
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-5 px-6 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold text-xl placeholder:text-surface-300"
                  placeholder="e.g. The Ultimate Python Mastery 2026"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-bold text-surface-700 mb-4 pl-1">
                  <FiEdit3 className="mr-2 text-primary-600" />
                  What will students achieve?
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-5 px-6 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-medium text-surface-700 leading-relaxed placeholder:text-surface-300"
                  placeholder="Write a clear, high-impact description of your course content..."
                  required
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="flex items-center text-sm font-bold text-surface-700 mb-4 pl-1">
                  <FiImage className="mr-2 text-primary-600" />
                  Course Thumbnail
                </label>

                {formData.thumbnail ? (
                  <div className="relative rounded-3xl overflow-hidden border-2 border-surface-100 aspect-video group">
                    <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="bg-white p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors shadow-xl"
                      >
                        <FiX className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploading}
                    />
                    <div className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${uploading ? 'border-primary-100 bg-primary-50/10' : 'border-surface-200 hover:border-primary-400 hover:bg-surface-50'}`}>
                      {uploading ? (
                        <div className="w-full max-w-xs text-center">
                          <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">{uploadProgress}% Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <FiUploadCloud className="text-5xl text-surface-200 mb-4" />
                          <p className="text-surface-700 font-bold mb-1 font-heading">Drop your cover image here</p>
                          <p className="text-surface-400 text-xs uppercase font-bold tracking-tighter">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Category */}
                <div>
                  <label className="flex items-center text-sm font-bold text-surface-700 mb-4 pl-1">
                    <FiLayers className="mr-2 text-primary-600" />
                    Primary Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-5 px-6 appearance-none focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold text-surface-700 cursor-pointer"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label className="flex items-center text-sm font-bold text-surface-700 mb-4 pl-1">
                    <FiBarChart2 className="mr-2 text-primary-600" />
                    Difficulty Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-5 px-6 appearance-none focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-bold text-surface-700 cursor-pointer"
                    required
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl} Level</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end items-center gap-6 pt-10 border-t border-surface-50">
                <button
                  type="button"
                  onClick={() => navigate('/instructor/dashboard')}
                  className="text-surface-400 font-bold hover:text-surface-600 px-6 py-4"
                >
                  Discard Draft
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="w-full md:w-auto bg-primary-600 text-white px-12 py-5 rounded-2xl font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span>Continue to Builder</span>
                      <FiCheckCircle className="text-xl" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
