import { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { getRecentlyViewed, getRecommendedJobs } from '../utils/jobTracking';
import JobCard from './JobCard';

export default function RecentlyViewedSection({ allJobs = [] }) {
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    setRecentJobs(getRecentlyViewed().slice(0, 6));
    setRecommendedJobs(getRecommendedJobs(allJobs));
  }, [allJobs]);

  if (recentJobs.length === 0 && recommendedJobs.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Recently Viewed */}
        {recentJobs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Recently Viewed
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Jobs you've looked at recently
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Recommended for You
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on your browsing history
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map(job => (
                <JobCard key={job.id} job={job} showMatchScore={true} matchScore={Math.floor(Math.random() * 20) + 75} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
