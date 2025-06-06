'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount and when localStorage changes
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };

    // Initial check
    checkAuth();

    // Listen for storage events (in case user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and site name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl">
              College Name
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium"
            >
              Home
            </Link>
            <Link 
              href="/events" 
              className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium"
            >
              Events
            </Link>
            {authenticated ? (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className="text-white hover:bg-blue-800 px-3 py-2 rounded-md font-medium"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/admin/login" 
                className="bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-blue-800 p-2 rounded-md"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="text-white hover:bg-blue-800 block px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/events" 
                className="text-white hover:bg-blue-800 block px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              {authenticated ? (
                <>
                  <Link 
                    href="/admin/dashboard" 
                    className="text-white hover:bg-blue-800 block px-3 py-2 rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-600 w-full text-left block px-3 py-2 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/admin/login" 
                  className="bg-blue-700 hover:bg-blue-600 block px-3 py-2 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
