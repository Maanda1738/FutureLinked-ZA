import { useState, useEffect } from 'react';
import Head from 'next/head';
import { CheckCircle, Clock, XCircle, ExternalLink, TrendingUp, Calendar, Building } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MatchScore from '../components/MatchScore';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Load applications from localStorage
    const savedApplications = localStorage.getItem('applications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    } else if (sortBy === 'match') {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    return 0;
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    pending: applications.filter(a => a.status === 'pending').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <>
      <Head>
        <title>My Applications | FutureLinked ZA</title>
        <meta name="description" content="Track all your job applications in one place" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track all your job applications and match scores in one place</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="text-3xl font-bold text-green-600">{stats.applied}</div>
              <div className="text-sm text-gray-600">Successfully Applied</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="text-3xl font-bold text-purple-600">
                {stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setFilter('applied')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'applied' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Applied ({stats.applied})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'pending' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="match">Sort by Match Score</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          {sortedApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? 'Use the Auto-Apply Bot to start applying to jobs automatically!'
                  : `No applications with status: ${filter}`
                }
              </p>
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Job Search
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedApplications.map((app, index) => (
                <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {app.jobTitle}
                        </h3>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        {app.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {app.company}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  {app.matchScore && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Match Score:</span>
                        <span className="text-lg font-bold text-blue-600">{app.matchScore}%</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex gap-3">
                    {app.redirect_url && (
                      <a
                        href={app.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Original Posting
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
