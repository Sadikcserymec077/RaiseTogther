import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import NotificationsDropdown from './NotificationsDropdown';
import { LogOut, User, Menu, X, ShieldCheck, LayoutList, Heart, Receipt, Trophy, AlertTriangle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">RaiseTogether</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">Discover</Link>
            <Link to="/leaderboard" className="text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-1">
              <Trophy size={16} /> Leaderboard
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationsDropdown />
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <Avatar name={user.name} url={user.profilePicture} size="sm" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link 
                        to="/my-campaigns" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutList size={16} /> My Campaigns
                      </Link>
                      <Link 
                        to="/bookmarks" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Heart size={16} /> Saved Campaigns
                      </Link>
                      <Link 
                        to="/my-donations" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Receipt size={16} /> My Donations
                      </Link>
                      {isAdmin && (
                        <>
                          <Link 
                            to="/admin/campaigns" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-indigo-50 flex items-center gap-2 border-t border-gray-100 mt-1 pt-2"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <ShieldCheck size={16} /> Admin Campaigns
                          </Link>
                          <Link 
                            to="/admin/reports" 
                            className="block px-4 py-2 text-sm text-primary hover:bg-indigo-50 flex items-center gap-2"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <AlertTriangle size={16} /> Admin Reports
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Log in</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors font-medium">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Discover</Link>
            <Link to="/leaderboard" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Leaderboard</Link>
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4 space-x-3">
                <Avatar name={user.name} url={user.profilePicture} size="md" />
                <div>
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/notifications" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Notifications</Link>
                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link to="/my-campaigns" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>My Campaigns</Link>
                <Link to="/bookmarks" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Saved Campaigns</Link>
                {isAdmin && (
                  <>
                    <Link to="/admin/campaigns" className="block px-4 py-2 text-base font-medium text-primary hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Admin Campaigns</Link>
                    <Link to="/admin/reports" className="block px-4 py-2 text-base font-medium text-primary hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Admin Reports</Link>
                  </>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
              <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              <Link to="/register" className="block px-4 py-2 text-base font-medium text-primary hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
