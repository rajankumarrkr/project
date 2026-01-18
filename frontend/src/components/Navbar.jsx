import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiBook, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${scrolled ? 'glass bg-white/80' : 'bg-transparent'}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <FiBook className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-surface-900 tracking-tight">Coursify</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-surface-600 hover:text-primary-600 font-semibold transition-colors">
                Courses
              </Link>

              {isAuthenticated ? (
                <>
                  {isInstructor && (
                    <Link to="/instructor/dashboard" className="text-surface-600 hover:text-primary-600 font-semibold transition-colors">
                      Instructor
                    </Link>
                  )}

                  {isStudent && (
                    <Link to="/student/dashboard" className="text-surface-600 hover:text-primary-600 font-semibold transition-colors">
                      My Learning
                    </Link>
                  )}

                  {/* User Profile */}
                  <div className="flex items-center space-x-4 pl-4 border-l border-surface-200">
                    <div className="flex items-center space-x-3 bg-surface-50 p-1.5 pr-4 rounded-xl border border-surface-100">
                      <img src={`https://i.pravatar.cc/150?u=${user?.email}`} className="w-8 h-8 rounded-lg shadow-sm" alt="profile" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-surface-900 truncate max-w-[100px]">{user?.name}</span>
                        <span className="text-[10px] text-primary-600 font-bold uppercase">{user?.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                      title="Logout"
                    >
                      <FiLogOut className="text-xl" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-surface-600 hover:text-primary-600 font-semibold transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-100 transition-all">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-surface-600 p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pt-2 pb-6 space-y-2 border-t border-surface-100 mt-2">
            <Link to="/courses" className="block px-4 py-3 text-surface-600 font-semibold hover:bg-surface-50 rounded-xl" onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            {isAuthenticated ? (
              <>
                {isInstructor && (
                  <Link to="/instructor/dashboard" className="block px-4 py-3 text-surface-600 font-semibold hover:bg-surface-50 rounded-xl" onClick={() => setIsOpen(false)}>
                    Instructor Dashboard
                  </Link>
                )}
                {isStudent && (
                  <Link to="/student/dashboard" className="block px-4 py-3 text-surface-600 font-semibold hover:bg-surface-50 rounded-xl" onClick={() => setIsOpen(false)}>
                    My Learning
                  </Link>
                )}
                <div className="px-4 py-3 border-t border-surface-100 mt-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={`https://i.pravatar.cc/150?u=${user?.email}`} className="w-10 h-10 rounded-lg" alt="profile" />
                    <div>
                      <p className="font-bold text-surface-900">{user?.name}</p>
                      <p className="text-xs text-primary-600 font-bold uppercase">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center space-x-2"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 space-y-4">
                <Link to="/login" className="block px-4 py-3 text-center text-surface-600 font-semibold border-2 border-surface-100 rounded-xl" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block px-4 py-3 text-center bg-primary-600 text-white font-bold rounded-xl" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
