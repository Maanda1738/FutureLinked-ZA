import { useState } from 'react';
import Head from 'next/head';
import { ExternalLink, MapPin, Calendar, Building, Heart, Trash2, Search } from 'lucide-react';
import { useSavedJobs } from '../context/SavedJobsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SavedJobs() {
  const { savedJobs, unsaveJob, clearAllSaved, savedCount } = useSavedJobs();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter saved jobs by search term
  const filteredJobs = savedJobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Saved Jobs | FutureLinked ZA</title>
        <meta name="description" content="View your saved job opportunities, bursaries, and scholarships" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Heart className="h-8 w-8 text-red-500 fill-current" />
                    Saved Jobs
                  </h1>
                  <p className="text-gray-600 mt-2">
                    You have {savedCount} saved {savedCount === 1 ? 'opportunity' : 'opportunities'}
                  </p>
                </div>
                
                {savedCount > 0 && (
                  <button
                    onClick={clearAllSaved}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Search Bar */}
              {savedCount > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search saved jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>

            {/* Empty State */}
            {savedCount === 0 && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">💼</div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  No saved jobs yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start saving jobs you're interested in to keep track of them here
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  <Search className="h-5 w-5" />
                  Search for Jobs
                </a>
              </div>
            )}

            {/* Saved Jobs List */}
            {savedCount > 0 && (
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">No jobs match your search</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <SavedJobCard key={job.id} job={job} onUnsave={unsaveJob} />
                  ))
                )}
              </div>
            )}

            {/* Helpful Tips */}
            {savedCount > 0 && (
              <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips:</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Saved jobs are stored in your browser and won't be lost when you close the tab</li>
                  <li>Apply to your saved jobs soon - opportunities can expire quickly!</li>
                  <li>Check back regularly to see if new similar jobs have been posted</li>
                  <li>Clear old saved jobs you're no longer interested in to keep your list organized</li>
                </ul>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function SavedJobCard({ job, onUnsave }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getDaysSaved = (savedAt) => {
    try {
      const saved = new Date(savedAt);
      const now = new Date();
      const diffDays = Math.floor((now - saved) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Saved today';
      if (diffDays === 1) return 'Saved yesterday';
      return `Saved ${diffDays} days ago`;
    } catch {
      return '';
    }
  };

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

  const opportunityType = detectOpportunityType(job);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-red-400">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-semibold text-gray-800">
              {job.title}
            </h3>
            {opportunityType && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getJobTypeColor(opportunityType)}`}>
                {getJobTypeIcon(opportunityType)} {opportunityType.toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
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
                <span>{formatDate(job.posted)}</span>
              </div>
            )}
          </div>

          {job.savedAt && (
            <p className="text-xs text-gray-500 italic">
              {getDaysSaved(job.savedAt)}
            </p>
          )}
        </div>
      </div>

      {job.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUnsave(job.id)}
            className="inline-flex items-center gap-1 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors font-medium"
            title="Remove from saved jobs"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
