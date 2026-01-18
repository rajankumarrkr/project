import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight, FiBookOpen } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'instructor') {
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
            <h2 className="text-4xl font-bold mb-6">Unlock Your Potential with Coursify</h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of learners and take your skills to the next level with our expert-led courses.
            </p>
            <div className="flex -space-x-3 mb-8 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <img key={i} className="w-12 h-12 rounded-full border-2 border-white/30" src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
              ))}
            </div>
            <p className="font-semibold">Loved by 45,000+ students worldwide</p>
          </div>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <div className="max-w-md w-full space-y-10 animate-fade-in">
          {/* Header */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8 group">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FiBookOpen className="text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 tracking-tight">Coursify</span>
            </Link>
            <h2 className="text-4xl font-bold text-surface-900 mb-3">Welcome Back</h2>
            <p className="text-surface-500 font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center space-x-3 animate-shake">
              <FiAlertCircle className="flex-shrink-0" />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
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
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-sm font-bold text-surface-700">
                    Password
                  </label>
                  <Link to="#" className="text-sm font-bold text-primary-600 hover:text-primary-700 cursor-not-allowed">
                    Forgot?
                  </Link>
                </div>
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
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-100 transition-all flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-surface-500 font-medium">
              New to Coursify?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold ml-1 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
