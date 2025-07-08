import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, UserIcon, LogOutIcon, CarIcon, SearchIcon, HistoryIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import WalletConnect from './WalletConnect';
const Header: React.FC = () => {
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Vehicrypt
            </span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? <>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <Link to="/dashboard/register-vehicle" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Register Vehicle
                </Link>
                <Link to="/dashboard/search" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Search
                </Link>
                <Link to="/dashboard/transactions" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Transactions
                </Link>
              </> : <>
                <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </Link>
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Register
                </Link>
              </>}
          </nav>
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && <>
                <WalletConnect />
                <div className="hidden md:flex items-center">
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">{user?.username}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        Role: {user?.role}
                      </div>
                      <button onClick={handleLogout} className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <LogOutIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>}
            {/* Mobile menu button */}
            <button onClick={toggleMenu} className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && <div className="md:hidden mt-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3">
              {isAuthenticated ? <>
                  <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <ShieldIcon className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/dashboard/register-vehicle" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <CarIcon className="h-5 w-5" />
                    <span>Register Vehicle</span>
                  </Link>
                  <Link to="/dashboard/search" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <SearchIcon className="h-5 w-5" />
                    <span>Search</span>
                  </Link>
                  <Link to="/dashboard/transactions" className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    <HistoryIcon className="h-5 w-5" />
                    <span>Transactions</span>
                  </Link>
                  <button onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }} className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <LogOutIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </> : <>
                  <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </>}
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;