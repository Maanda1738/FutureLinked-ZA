import { createContext, useContext, useEffect, useState } from 'react';

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('bookmarkedJobs');
    if (saved) {
      setBookmarkedJobs(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (job) => {
    setBookmarkedJobs(prev => {
      const isBookmarked = prev.some(j => j.id === job.id);
      let updated;
      
      if (isBookmarked) {
        updated = prev.filter(j => j.id !== job.id);
      } else {
        updated = [...prev, { ...job, bookmarkedAt: new Date().toISOString() }];
      }
      
      localStorage.setItem('bookmarkedJobs', JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (jobId) => {
    return bookmarkedJobs.some(j => j.id === jobId);
  };

  const clearBookmarks = () => {
    setBookmarkedJobs([]);
    localStorage.removeItem('bookmarkedJobs');
  };

  return (
    <BookmarkContext.Provider value={{ 
      bookmarkedJobs, 
      toggleBookmark, 
      isBookmarked,
      clearBookmarks
    }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
