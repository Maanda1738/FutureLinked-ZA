import { useState } from 'react';
import { useBookmarks } from '../context/BookmarkContext';
import { Bookmark, BookmarkCheck, Share2, BarChart2, Clock, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { trackViewedJob, trackJobInteraction, addToComparison } from '../utils/jobTracking';

export default function JobCard({ job, showMatchScore = false, matchScore = 0 }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [addedToCompare, setAddedToCompare] = useState(false);
  
  const bookmarked = isBookmarked(job.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(job);
  };

  const handleShare = (e, platform) => {
    e.preventDefault();
    e.stopPropagation();
    trackJobInteraction(job, 'share');
    
    const url = `${window.location.origin}/job/${job.id}`;
    const text = `Check out this job: ${job.title} at ${job.company || 'a great company'}`;
    
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        setShowShareMenu(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setShowShareMenu(false);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToComparison(job);
    if (success) {
      setAddedToCompare(true);
      setTimeout(() => setAddedToCompare(false), 2000);
    }
  };

  const handleClick = () => {
    trackViewedJob(job);
    trackJobInteraction(job, 'view');
  };

  return (
    <div 
      onClick={handleClick}
      className="job-card bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer relative"
    >
      {/* Match Score Badge */}
      {showMatchScore && matchScore > 0 && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <BarChart2 className="h-4 w-4" />
          {matchScore}% Match
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-lg transition-all ${
            bookmarked 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </button>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShareMenu(!showShareMenu);
            }}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-all"
            aria-label="Share job"
          >
            <Share2 className="h-4 w-4" />
          </button>
          
          {showShareMenu && (
            <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 z-10 min-w-[160px] border border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => handleShare(e, 'whatsapp')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-sm"
              >
                📱 WhatsApp
              </button>
              <button
                onClick={(e) => handleShare(e, 'linkedin')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-sm"
              >
                💼 LinkedIn
              </button>
              <button
                onClick={(e) => handleShare(e, 'twitter')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-sm"
              >
                🐦 Twitter
              </button>
              <button
                onClick={(e) => handleShare(e, 'facebook')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-sm"
              >
                📘 Facebook
              </button>
              <button
                onClick={(e) => handleShare(e, 'copy')}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2 text-sm"
              >
                🔗 Copy Link
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleCompare}
          className={`p-2 rounded-lg transition-all ${
            addedToCompare
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
          aria-label="Add to comparison"
        >
          <BarChart2 className="h-4 w-4" />
        </button>
      </div>

      {/* Job Content */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          {job.title}
        </h3>
        
        {job.company && (
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-3">
            {job.company}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          {job.location && (
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          )}
          
          {job.salary && (
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4" />
              {job.salary}
            </span>
          )}
          
          {job.posted && (
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              {job.posted}
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
            {job.description}
          </p>
        )}

        {job.category && (
          <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium">
            {job.category}
          </span>
        )}

        <div className="mt-4 flex gap-2">
          <a
            href={job.url || job.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackJobInteraction(job, 'click');
            }}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
