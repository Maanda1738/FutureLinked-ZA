import { ExternalLink, MapPin, Calendar, Building, Loader, ChevronDown, Star, Heart, MessageCircle } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { logShare } from '../utils/analytics';

export default function SearchResults({ results, loading, loadingMore, query, totalResults, currentCount, onLoadMore }) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center items-center mb-4">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          🤖 Our AI robot is searching for you...
        </h3>
        <p className="text-gray-500">
          Scanning company websites and job boards for "{query}"
        </p>
        <div className="flex justify-center mt-4 space-x-1">
          <div className="loading-dots w-2 h-2 bg-primary-600 rounded-full"></div>
          <div className="loading-dots w-2 h-2 bg-primary-600 rounded-full"></div>
          <div className="loading-dots w-2 h-2 bg-primary-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No jobs found for "{query}"
        </h3>
        <div className="space-y-3 text-gray-500 max-w-md mx-auto">
          <p>We searched real job boards across South Africa but couldn't find matches for your query.</p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">💡 Try these tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Use broader terms like "developer" instead of "React developer"</li>
              <li>Try different keywords like "analyst", "coordinator", "specialist"</li>
              <li>Search for "internship", "graduate program", or "bursary"</li>
              <li>Remove location filters to see all South African opportunities</li>
            </ul>
          </div>
          
          <p className="text-sm">
            🔄 We search through thousands of jobs via Adzuna's comprehensive South African database.
            Try different keywords or check back soon!
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Popular searches to try:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {['IT jobs', 'Data analyst', 'Marketing', 'Accounting', 'Engineering', 'Sales'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => window.location.href = `/?search=${encodeURIComponent(suggestion)}`}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Search Results for "{query}"
        </h2>
        <div className="text-sm text-gray-500">
          Showing {currentCount} of {totalResults} opportunities
        </div>
      </div>

      <div className="space-y-4">
        {results.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      {/* Load More Button */}
      {currentCount < totalResults && (
        <div className="text-center mt-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5" />
                View More ({totalResults - currentCount} more available)
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {currentCount} of {totalResults} opportunities
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="text-center mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-sm font-semibold text-green-700">
              ✅ Fresh Jobs Only - Posted within last 7 days
            </p>
          </div>
          <p className="text-xs text-blue-600">
            Powered by Adzuna API • Updated in real-time • No old or duplicate listings
          </p>
        </div>
      )}
    </div>
  );
}

function JobCard({ job }) {
  const { saveJob, unsaveJob, isSaved } = useSavedJobs();
  const saved = isSaved(job.id);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    if (saved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };
  
  const getRelativeTime = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays} days ago`;
      return null;
    } catch {
      return null;
    }
  };

  // Helper to detect bursary/scholarship from title and description
  const detectOpportunityType = (job) => {
    const text = `${job.title} ${job.description || ''}`.toLowerCase();
    if (text.includes('bursary') || text.includes('bursaries')) return 'bursary';
    if (text.includes('scholarship')) return 'scholarship';
    if (text.includes('internship')) return 'internship';
    if (text.includes('learnership')) return 'learnership';
    if (text.includes('graduate program') || text.includes('graduate programme')) return 'graduate';
    return job.type;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'bursary': 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md',
      'scholarship': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md',
      'internship': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md',
      'learnership': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md',
      'graduate': 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md',
      'job': 'bg-gray-100 text-gray-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type?.toLowerCase()] || colors.default;
  };
  
  const getJobTypeIcon = (type) => {
    const icons = {
      'bursary': '💰',
      'scholarship': '🎯',
      'internship': '💼',
      'learnership': '📚',
      'graduate': '🎓',
    };
    return icons[type?.toLowerCase()] || '';
  };
  
  const isNewJob = job.daysOld !== undefined && job.daysOld <= 3;
  const relativeTime = getRelativeTime(job.posted);
  const opportunityType = detectOpportunityType(job);

  // Generate JobPosting schema for SEO
  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || job.title,
    "datePosted": job.posted || new Date().toISOString(),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company || "Employer",
      "sameAs": job.url
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "South Africa",
        "addressCountry": "ZA"
      }
    },
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "ZAR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "YEAR"
      }
    } : undefined,
    "employmentType": opportunityType === 'internship' ? 'INTERN' : 
                      opportunityType === 'graduate' ? 'FULL_TIME' : 'FULL_TIME',
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days validity
    "url": job.url
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      <div className="job-card bg-white p-6 rounded-lg hover:shadow-lg relative border-l-4 border-transparent hover:border-primary-500 transition-all">
      {/* ✅ Fresh Job Badge */}
      {isNewJob && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold animate-pulse shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            NEW
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-semibold text-gray-800 hover:text-primary-600">
              {job.title}
            </h3>
            {opportunityType && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobTypeColor(opportunityType)}`}>
                {getJobTypeIcon(opportunityType)} {opportunityType.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {job.company && (
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.posted && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className={`font-semibold ${relativeTime ? 'text-green-600' : 'text-gray-600'}`}>
                  {relativeTime ? (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        {relativeTime}
                      </span>
                    </>
                  ) : (
                    formatDate(job.posted)
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {job.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {job.description}
        </p>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Key Requirements:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {job.salary && (
            <span className="text-sm font-medium text-green-600">
              {job.salary}
            </span>
          )}
          {job.source && (
            <span className="text-xs text-gray-500">
              via {job.source}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* WhatsApp Share Button */}
          <button
            onClick={() => {
              const message = `🔥 Check out this job opportunity!\n\n${job.title}\n${job.company ? `at ${job.company}` : ''}\n${job.location || 'South Africa'}\n\nApply here: ${job.url}\n\nFound on FutureLinked ZA 🇿🇦`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
              logShare('job', job.title, 'whatsapp');
            }}
            className="inline-flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-1 px-4 py-2 rounded-md font-medium transition-all flex-1 sm:flex-initial justify-center ${
              saved 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={saved ? 'Remove from saved jobs' : 'Save for later'}
          >
            {saved ? (
              <>
                <Heart className="h-4 w-4 fill-current" />
                <span className="sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Star className="h-4 w-4" />
                <span className="sm:inline">Save</span>
              </>
            )}
          </button>

          {/* Apply Now Button */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium flex-1 sm:flex-initial justify-center"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
    </>
  );
}