import Link from 'next/link';
import Image from 'next/image';
import { Heart, Menu, X, FileCheck, Moon, Sun, Bookmark } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../context/BookmarkContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { savedCount } = useSavedJobs();
  const { darkMode = false, toggleDarkMode = () => {} } = useTheme() || {};
  const { bookmarkedJobs = [] } = useBookmarks() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    // Load applications count
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplicationsCount(applications.length);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
              <Image 
                src="/logo.svg" 
                alt="FutureLinked ZA Logo" 
                width={40} 
                height={40}
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                FutureLinked ZA
              </h1>
              <p className="text-xs text-gray-500">Your Career Starts Here</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/saved-jobs" className="relative text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Saved
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </Link>
            <Link href="/universities" className="text-gray-600 hover:text-primary-600 transition-colors">
              Universities
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-primary-600 transition-colors">
              Resources
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                href="/saved-jobs" 
                className="relative text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5" />
                Saved Jobs
                {savedCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {savedCount}
                  </span>
                )}
              </Link>
              <Link 
                href="/universities" 
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                🎓 Universities
              </Link>
              <Link 
                href="/resources" 
                className="text-gray-600 hover:text-primary-600 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                📚 Resources
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}