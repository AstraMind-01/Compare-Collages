import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { LogOut, User as UserIcon, BookOpen, Layers } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">CollegesHub</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/compare" 
                className={({ isActive }) => `inline-flex items-center gap-1.5 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'}`}
              >
                {({ isActive }) => (
                  <>
                    <Layers className="w-4 h-4" /> Compare
                    {compareList.length > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {compareList.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-1">
                  <UserIcon className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium px-3 py-2">
                  Log in
                </Link>
                <Link to="/signup" className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Sign up
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
