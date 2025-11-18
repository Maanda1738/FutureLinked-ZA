import { ExternalLink, MapPin, Calendar, Building, Loader, ChevronDown, Star, Heart, MessageCircle } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import { logShare } from '../utils/analytics';
import { useState, useEffect } from 'react';
import { calculateMatchScore } from '../utils/cvMatcher';
import MatchScore from './MatchScore';

export default function SearchResults({ results, loading, loadingMore, query, totalResults, currentCount, onLoadMore, cvData }) {
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
      {/* Results Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🔍 Results for "{query}"
            </h2>
            <p className="text-gray-600">
              Found <span className="font-semibold text-blue-600">{totalResults}</span> opportunities • 
              Showing <span className="font-semibold text-purple-600">{currentCount}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-700 font-medium">Fresh Jobs Only (Last 7 days)</span>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="space-y-5">
        {results.map((job, index) => (
          <JobCard key={index} job={job} cvData={cvData} />
        ))}
      </div>

      {/* Load More Button */}
      {currentCount < totalResults && (
        <div className="text-center mt-10">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {loadingMore ? (
              <>
                <Loader className="h-6 w-6 animate-spin" />
                Loading more opportunities...
              </>
            ) : (
              <>
                <ChevronDown className="h-6 w-6" />
                Load More Jobs ({totalResults - currentCount} remaining)
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer Info */}
      {results.length > 0 && (
        <div className="text-center mt-8 p-5 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl border-2 border-green-200">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <p className="text-lg font-bold text-gray-800">
              All jobs are verified and up-to-date
            </p>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-sm text-gray-600">
            🔥 Powered by Adzuna, Jooble & Google APIs • Updated in real-time • Direct application links
          </p>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, cvData: cvDataProp }) {
  const { saveJob, unsaveJob, isSaved } = useSavedJobs();
  const saved = isSaved(job.id);
  const [matchData, setMatchData] = useState(null);
  
  // Use cvData directly from prop or localStorage (synchronously)
  let cvData = cvDataProp;
  if (!cvData) {
    try {
      const storedCvData = localStorage.getItem('cvData');
      if (storedCvData) {
        cvData = JSON.parse(storedCvData);
      }
    } catch (error) {
      console.error('Error parsing CV data:', error);
    }
  }

  // Calculate match score if CV is uploaded
  useEffect(() => {
    if (cvData) {
      try {
        const score = calculateMatchScore(cvData, {
          description: job.description || job.title || '',
        });
        setMatchData(score);
      } catch (error) {
        console.error('Error calculating match score:', error);
      }
    }
  }, [job, cvData]);

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

      <div className="job-card bg-white rounded-2xl shadow-md hover:shadow-2xl relative border border-gray-100 hover:border-blue-300 transition-all transform hover:-translate-y-1 overflow-hidden">
      {/* Colored Top Border based on opportunity type */}
      <div className={`h-2 ${
        opportunityType === 'bursary' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
        opportunityType === 'scholarship' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
        opportunityType === 'internship' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
        opportunityType === 'learnership' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
        opportunityType === 'graduate' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
        'bg-gradient-to-r from-blue-500 to-purple-500'
      }`} />
      
      <div className="p-6">
        {/* ✅ Fresh Job Badge */}
        {isNewJob && (
          <div className="absolute top-6 right-6">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold animate-pulse shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              NEW
            </span>
          </div>
        )}
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1 pr-16">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h3 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              {opportunityType && (
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getJobTypeColor(opportunityType)} transform hover:scale-105 transition-transform`}>
                  {getJobTypeIcon(opportunityType)} {opportunityType.toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Job Meta Information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              {job.company && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{job.company}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{job.location}</span>
                </div>
              )}
              {job.posted && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className={`font-semibold ${relativeTime ? 'text-green-600' : 'text-gray-600'}`}>
                    {relativeTime ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        {relativeTime}
                      </span>
                    ) : (
                      formatDate(job.posted)
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Description */}
      {job.description && (
        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {job.description}
          </p>
        </div>
      )}

      {/* Match Score Display */}
      {matchData && (
        <div className="mb-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <MatchScore 
            score={matchData.score} 
            breakdown={matchData.breakdown} 
            recommendation={matchData.recommendation}
            cvData={cvData}
            jobTitle={job.title}
          />
        </div>
      )}

      {/* Requirements Section */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-5 bg-gray-50 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-lg">📋</span>
            Key Requirements:
          </h4>
          <ul className="space-y-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          {job.salary && (
            <div className="flex items-center gap-1.5 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-lg">💰</span>
              <span className="text-sm font-bold text-green-700">{job.salary}</span>
            </div>
          )}
          {job.source && (
            <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              via {job.source}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* WhatsApp Share Button */}
          <button
            onClick={() => {
              const message = `🔥 Check out this job opportunity!\n\n${job.title}\n${job.company ? `at ${job.company}` : ''}\n${job.location || 'South Africa'}\n\nApply here: ${job.url}\n\nFound on FutureLinked ZA 🇿🇦`;
              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, '_blank');
              logShare('job', job.title, 'whatsapp');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Share</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
              saved 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={saved ? 'Remove from saved jobs' : 'Save for later'}
          >
            {saved ? (
              <>
                <Heart className="h-5 w-5 fill-current" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Star className="h-5 w-5" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Apply Now Button - PRIMARY CTA */}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-lg">🚀</span>
            Apply Now
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}