import { createContext, useContext, useEffect, useState } from 'react';

const CompanyFollowContext = createContext();

export function CompanyFollowProvider({ children }) {
  const [followedCompanies, setFollowedCompanies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('followedCompanies');
    if (saved) {
      setFollowedCompanies(JSON.parse(saved));
    }
  }, []);

  const followCompany = (company) => {
    setFollowedCompanies(prev => {
      const isFollowing = prev.some(c => c.name === company.name);
      if (isFollowing) return prev;

      const updated = [...prev, { ...company, followedAt: new Date().toISOString() }];
      localStorage.setItem('followedCompanies', JSON.stringify(updated));
      return updated;
    });
  };

  const unfollowCompany = (companyName) => {
    setFollowedCompanies(prev => {
      const updated = prev.filter(c => c.name !== companyName);
      localStorage.setItem('followedCompanies', JSON.stringify(updated));
      return updated;
    });
  };

  const isFollowing = (companyName) => {
    return followedCompanies.some(c => c.name === companyName);
  };

  return (
    <CompanyFollowContext.Provider value={{ 
      followedCompanies, 
      followCompany, 
      unfollowCompany,
      isFollowing
    }}>
      {children}
    </CompanyFollowContext.Provider>
  );
}

export function useCompanyFollow() {
  const context = useContext(CompanyFollowContext);
  if (context === undefined) {
    throw new Error('useCompanyFollow must be used within a CompanyFollowProvider');
  }
  return context;
}
