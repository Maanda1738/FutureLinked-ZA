import { useState } from 'react';
import { UserPlus, UserCheck, Building2 } from 'lucide-react';
import { useCompanyFollow } from '../context/CompanyFollowContext';

export default function CompanyFollowButton({ company }) {
  const { isFollowing, followCompany, unfollowCompany } = useCompanyFollow();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const following = isFollowing(company.name);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (following) {
      unfollowCompany(company.name);
    } else {
      followCompany(company);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          following
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200'
            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200'
        }`}
      >
        {following ? (
          <>
            <UserCheck className="h-4 w-4" />
            <span className="text-sm">Following</span>
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            <span className="text-sm">Follow Company</span>
          </>
        )}
      </button>

      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
          You'll get updates on new jobs from {company.name}
        </div>
      )}
    </div>
  );
}
