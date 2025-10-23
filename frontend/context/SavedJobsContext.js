import { createContext, useContext, useState, useEffect } from 'react';

const SavedJobsContext = createContext();

export function SavedJobsProvider({ children }) {
  const [savedJobs, setSavedJobs] = useState([]);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('futurelinked_saved_jobs');
    if (stored) {
      try {
        setSavedJobs(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('futurelinked_saved_jobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const saveJob = (job) => {
    setSavedJobs(prev => {
      // Check if already saved
      if (prev.some(j => j.id === job.id)) {
        return prev;
      }
      return [...prev, { ...job, savedAt: new Date().toISOString() }];
    });
  };

  const unsaveJob = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const isSaved = (jobId) => {
    return savedJobs.some(job => job.id === jobId);
  };

  const clearAllSaved = () => {
    if (confirm('Are you sure you want to clear all saved jobs?')) {
      setSavedJobs([]);
    }
  };

  return (
    <SavedJobsContext.Provider value={{ 
      savedJobs, 
      saveJob, 
      unsaveJob, 
      isSaved, 
      clearAllSaved,
      savedCount: savedJobs.length 
    }}>
      {children}
    </SavedJobsContext.Provider>
  );
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error('useSavedJobs must be used within SavedJobsProvider');
  }
  return context;
}
