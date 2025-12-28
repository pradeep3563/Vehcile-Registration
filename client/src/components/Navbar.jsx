import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Car, LogOut, User, Shield, LayoutDashboard, Menu, X, ChevronDown, RefreshCw } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const handleSwitchRole = (targetRole) => {
    logout();
    navigate('/login', { state: { role: targetRole } });
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-3 hover:text-blue-400 transition group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition shadow-lg shadow-blue-900/50">
               <Car size={24} className="text-white" />
            </div>
            <span className="tracking-tight">Vehicle<span className="text-blue-400">Reg</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="bg-blue-500 rounded-full p-1">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-sm">{user.name}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 text-gray-800 border border-gray-100 transform origin-top-right transition-all animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={18} className="text-blue-600" /> My Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Shield size={18} className="text-purple-600" /> Admin Panel
                      </Link>
                    )}

                    <button 
                      onClick={() => handleSwitchRole(user.role === 'admin' ? 'user' : 'admin')}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                    >
                      <RefreshCw size={18} className="text-orange-500" /> Login as {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition text-sm font-medium"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition px-4 py-2">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/50 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-slideDown">
            {user ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-white/5 rounded-lg mb-4">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="font-bold">{user.name}</p>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-3 hover:bg-white/10 rounded-lg transition flex items-center gap-3"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-3 hover:bg-white/10 rounded-lg transition flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield size={20} /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleSwitchRole(user.role === 'admin' ? 'user' : 'admin');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-lg transition flex items-center gap-3"
                >
                  <RefreshCw size={20} className="text-orange-400" /> Login as {user.role === 'admin' ? 'User' : 'Admin'}
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} 
                  className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition flex items-center gap-3"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  className="block text-center py-3 hover:bg-white/10 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-500 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
