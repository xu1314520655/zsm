
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Trophy, User, Home } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const Navbar = () => {
  const location = useLocation();
  const user = useStore(state => state.user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                DataLearn
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">首页</span>
            </Link>

            <Link
              to="/courses"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/courses')
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">课程</span>
            </Link>

            <Link
              to="/achievements"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/achievements')
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">成就</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/profile')
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{user.avatar}</span>
            </Link>

            <div className="ml-4 flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-lg shadow-md">
              <span className="text-lg">⭐</span>
              <span className="font-bold text-white">{user.totalPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

