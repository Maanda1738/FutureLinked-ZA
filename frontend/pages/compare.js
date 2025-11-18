import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getComparisonJobs, removeFromComparison, clearComparison } from '../utils/jobTracking';
import { BarChart2, X, MapPin, DollarSign, Clock, ExternalLink, Trash2 } from 'lucide-react';

export default function ComparePage() {
  const [comparisonJobs, setComparisonJobs] = useState([]);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = () => {
    setComparisonJobs(getComparisonJobs());
  };

  const handleRemove = (jobId) => {
    removeFromComparison(jobId);
    loadComparison();
  };

  const handleClearAll = () => {
    if (confirm('Remove all jobs from comparison?')) {
      clearComparison();
      loadComparison();
    }
  };

  const comparisonFields = [
    { key: 'title', label: 'Job Title' },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
    { key: 'salary', label: 'Salary' },
    { key: 'category', label: 'Category' },
    { key: 'posted', label: 'Posted Date' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <>
      <Head>
        <title>Compare Jobs - FutureLinked ZA</title>
        <meta name="description" content="Compare multiple job opportunities side by side" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                  <BarChart2 className="h-8 w-8 text-purple-600" />
                  Compare Jobs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare up to 3 jobs side by side
                </p>
              </div>
              
              {comparisonJobs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Empty State */}
            {comparisonJobs.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
                <BarChart2 className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  No Jobs to Compare
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Click the comparison icon on any job card to add it here and compare opportunities side by side.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Search Jobs
                </Link>
              </div>
            )}

            {/* Comparison Table */}
            {comparisonJobs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Field
                        </th>
                        {comparisonJobs.map((job, idx) => (
                          <th key={idx} className="px-6 py-4 text-left relative">
                            <button
                              onClick={() => handleRemove(job.id)}
                              className="absolute top-2 right-2 p-1 rounded bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 pr-8">
                              Job {idx + 1}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {comparisonFields.map((field, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {field.label}
                          </td>
                          {comparisonJobs.map((job, jobIdx) => (
                            <td key={jobIdx} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                              {field.key === 'description' ? (
                                <div className="max-w-xs line-clamp-3">
                                  {job[field.key] || '-'}
                                </div>
                              ) : (
                                job[field.key] || '-'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Action
                        </td>
                        {comparisonJobs.map((job, idx) => (
                          <td key={idx} className="px-6 py-4">
                            <a
                              href={job.url || job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                            >
                              Apply Now
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
