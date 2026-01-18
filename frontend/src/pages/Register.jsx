import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiArrowRight, FiBookOpen, FiAward } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      if (formData.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Side Image / Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-600">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 opacity-90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
            <p className="text-xl text-primary-100 mb-8">
              Create an account and get access to over 15,000 top-rated courses from experts.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <FiBookOpen className="text-3xl mb-3 mx-auto" />
                <p className="text-sm font-bold uppercase tracking-wider">Expert Content</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <FiAward className="text-3xl mb-3 mx-auto" />
                <p className="text-sm font-bold uppercase tracking-wider">Certificates</p>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FiBookOpen className="text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 tracking-tight">Coursify</span>
            </Link>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Create Account</h2>
            <p className="text-surface-500 font-medium">Join our community of over 2 million learners.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-3">
              <FiAlertCircle className="flex-shrink-0" />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-surface-700 mb-2 pl-1">
                  Full Name
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-700 mb-2 pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-medium"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-700 mb-2 pl-1">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-600 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl py-3.5 pl-12 pr-4 focus:bg-white focus:border-primary-500 focus:outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-2 text-xs text-surface-400 pl-1 font-medium">Minimum 6 characters required</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-surface-700 mb-3 pl-1">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${formData.role === 'student'
                        ? 'border-primary-500 bg-primary-50/50 text-primary-700 shadow-sm shadow-primary-100'
                        : 'border-surface-100 bg-surface-50 text-surface-500 hover:border-surface-200'
                      }`}
                  >
                    <FiUser className="text-2xl mb-2" />
                    <span className="font-bold">Learn</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center ${formData.role === 'instructor'
                        ? 'border-primary-500 bg-primary-50/50 text-primary-700 shadow-sm shadow-primary-100'
                        : 'border-surface-100 bg-surface-50 text-surface-500 hover:border-surface-200'
                      }`}
                  >
                    <FiAward className="text-2xl mb-2" />
                    <span className="font-bold">Teach</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-surface-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
