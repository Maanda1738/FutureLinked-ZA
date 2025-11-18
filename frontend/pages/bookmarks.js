import Head from 'next/head';
import Link from 'next/link';
import { useBookmarks } from '../context/BookmarkContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { Bookmark, Trash2, Share2 } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarkedJobs, clearBookmarks } = useBookmarks();

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all bookmarks?')) {
      clearBookmarks();
    }
  };

  const sortedJobs = [...bookmarkedJobs].sort((a, b) => 
    new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)
  );

  return (
    <>
      <Head>
        <title>My Bookmarks - FutureLinked ZA</title>
        <meta name="description" content="View your bookmarked jobs, internships, and opportunities" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                  <Bookmark className="h-8 w-8 text-blue-600" />
                  My Bookmarks
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {bookmarkedJobs.length} {bookmarkedJobs.length === 1 ? 'job' : 'jobs'} bookmarked
                </p>
              </div>
              
              {bookmarkedJobs.length > 0 && (
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
            {bookmarkedJobs.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
                <Bookmark className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  No Bookmarks Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start bookmarking jobs you're interested in to keep track of opportunities you want to apply to later.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Search Jobs
                </Link>
              </div>
            )}

            {/* Bookmarked Jobs Grid */}
            {bookmarkedJobs.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
