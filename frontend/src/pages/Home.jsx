import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiAward, FiTrendingUp, FiArrowRight, FiPlay } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-surface-50">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary-100/50 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary-100/50 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left animate-slide-up">
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary-600 uppercase bg-primary-50 rounded-full">
                The Future of Learning
              </span>
              <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-[1.1]">
                Master New Skills <br />
                <span className="text-gradient">Without Limits</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-surface-600 max-w-xl">
                Join 10M+ learners worldwide and discover thousands of expert-led courses designed to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600">
                  Join for Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/courses" className="inline-flex items-center justify-center px-8 py-4 font-semibold text-surface-900 transition-all duration-200 bg-white border-2 border-surface-200 rounded-xl hover:bg-surface-50 focus:outline-none">
                  Explore Courses
                </Link>
              </div>

              <div className="mt-12 flex items-center space-x-8 text-surface-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                    +2k
                  </div>
                </div>
                <p className="text-sm">Join <span className="font-bold text-surface-900">45k+ students</span> already learning</p>
              </div>
            </div>

            <div className="relative animate-fade-in hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden glass p-4 aspect-square max-w-lg mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/artifacts/hero_learning_illustration.png"
                  alt="Learning Illustration"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl animate-float">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FiTrendingUp className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">95% Success Rate</p>
                      <p className="text-xs text-surface-500">Industry standards</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 glass p-6 rounded-2xl animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                      <FiAward />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Certified Platform</p>
                      <p className="text-xs text-surface-500">Global recognition</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-surface-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h4 className="text-4xl font-bold mb-1">15k+</h4>
              <p className="text-surface-500 uppercase tracking-wider text-xs font-bold">Online Courses</p>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-bold mb-1">100k+</h4>
              <p className="text-surface-500 uppercase tracking-wider text-xs font-bold">Expert Tutors</p>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-bold mb-1">2M+</h4>
              <p className="text-surface-500 uppercase tracking-wider text-xs font-bold">Active Students</p>
            </div>
            <div className="text-center">
              <h4 className="text-4xl font-bold mb-1">4.8/5</h4>
              <p className="text-surface-500 uppercase tracking-wider text-xs font-bold">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose <span className="text-gradient">Coursify?</span></h2>
            <p className="text-xl text-surface-600 text-center">We provide the tools and resources you need to achieve your learning goals twice as fast.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiBookOpen, title: 'Quality Content', desc: 'Curated courses from industry professionals with real-world experience.', color: 'bg-blue-50 text-blue-600' },
              { icon: FiUsers, title: 'Active Community', desc: 'Connect with millions of learners and share knowledge in real-time.', color: 'bg-purple-50 text-purple-600' },
              { icon: FiAward, title: 'Global Certificates', desc: 'Earn recognized certificates to boost your career prospects worldwide.', color: 'bg-orange-50 text-orange-600' },
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 bg-white rounded-3xl border border-surface-100 card-hover shadow-sm">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-300`}>
                  <feature.icon className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-surface-600 leading-relaxed mb-6">{feature.desc}</p>
                <Link to="/courses" className="text-primary-600 font-bold inline-flex items-center hover:underline">
                  Learn more <FiArrowRight className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-surface-900 rounded-[3rem] p-12 md:p-24 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600 opacity-20 blur-[120px] rounded-full translate-x-1/2" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-white">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start your <br /> <span className="text-primary-400">learning journey?</span></h2>
                <p className="text-xl text-surface-300 mb-10 max-w-md">
                  Join thousand of students who are already growing their skill with Coursify. Get started for free today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/register" className="px-8 py-4 bg-white text-surface-900 font-bold rounded-xl hover:bg-surface-100 transition-colors">
                    Enroll Now
                  </Link>
                  <Link to="/courses" className="px-8 py-4 bg-transparent border-2 border-surface-700 text-white font-bold rounded-xl hover:bg-surface-800 transition-colors">
                    View Courses
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="glass-dark p-2 rounded-2xl">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-surface-800 flex items-center justify-center">
                    <FiPlay className="text-6xl text-white/50 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
