import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import EnhancedAdBanner from '../components/EnhancedAdBanner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePageTracking, logSearch } from '../utils/analytics';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');

  // Page tracking
  usePageTracking();

  const handleSearch = async (query, location = '') => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchQuery(query);
    setSearchLocation(location);
    setCurrentPage(1);
    setHasSearched(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1&limit=15`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results || []);
        setTotalResults(data.total || 0);
        
        // Log search analytics
        logSearch(query, data.results ? data.results.length : 0);
      } else {
        console.error('Search failed:', data.error);
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}&page=${nextPage}&limit=15`);
      const data = await response.json();
      
      if (data.success && data.results && data.results.length > 0) {
        setSearchResults(prev => [...prev, ...data.results]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <Head>
        <title>FutureLinked ZA - Search your future. Linked instantly.</title>
        <meta name="description" content="Find verified jobs, internships, graduate programs, and bursaries across South Africa. Instant search, direct applications. Powered by AI." />
        <meta name="keywords" content="jobs south africa, internships, graduate programs, bursaries, job search, careers, employment" />
        
        {/* Open Graph */}
        <meta property="og:title" content="FutureLinked ZA - Smart Job Search for South Africa" />
        <meta property="og:description" content="Find verified jobs, internships, graduate programs, and bursaries. Instant AI-powered search across South Africa." />
        <meta property="og:url" content="https://futurelinked.co.za" />
        
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <div className={`${hasSearched ? 'py-8' : 'py-20'} search-gradient transition-all duration-500`}>
            <div className="container mx-auto px-4 text-center">
              {!hasSearched && (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                    FutureLinked ZA
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-6">
                    Smart job search assistant for South Africa
                  </p>
                  <p className="text-lg text-blue-200 mb-4 max-w-3xl mx-auto">
                    Making finding opportunities in South Africa simple, fast, and stress-free
                  </p>
                  <p className="text-md text-blue-300 mb-12 max-w-2xl mx-auto">
                    Powered by intelligent automation and Adzuna API • No sign-ups • No downloads • Just search
                  </p>
                </>
              )}
              
              <div className="max-w-3xl mx-auto">
                <SearchBar onSearch={handleSearch} loading={loading} />
                
                {/* Quick Search Buttons for Students */}
                {!hasSearched && (
                  <div className="mt-8">
                    <p className="text-sm text-blue-200 mb-3 font-semibold">🎓 Popular Student Searches:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => handleSearch('bursary', '')}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-all border border-white border-opacity-30 backdrop-blur-sm"
                      >
                        💰 Bursaries
                      </button>
                      <button
                        onClick={() => handleSearch('scholarship', '')}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-all border border-white border-opacity-30 backdrop-blur-sm"
                      >
                        🎯 Scholarships
                      </button>
                      <button
                        onClick={() => handleSearch('internship', '')}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-all border border-white border-opacity-30 backdrop-blur-sm"
                      >
                        💼 Internships
                      </button>
                      <button
                        onClick={() => handleSearch('graduate program', '')}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-all border border-white border-opacity-30 backdrop-blur-sm"
                      >
                        🎓 Graduate Programs
                      </button>
                      <button
                        onClick={() => handleSearch('learnership', '')}
                        className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full text-sm font-medium transition-all border border-white border-opacity-30 backdrop-blur-sm"
                      >
                        📚 Learnerships
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="container mx-auto px-4 py-8">
              {/* Top Ad Banner */}
              <EnhancedAdBanner 
                type="banner" 
                className="mb-8"
                adText="Sponsored Content"
                placement="top"
              />

              <SearchResults 
                results={searchResults}
                loading={loading}
                loadingMore={loadingMore}
                query={searchQuery}
                totalResults={totalResults}
                currentCount={searchResults.length}
                onLoadMore={handleLoadMore}
              />

              {/* Middle Video Ad */}
              {searchResults.length > 5 && (
                <EnhancedAdBanner 
                  type="video" 
                  className="my-8"
                  adText="Featured Content"
                  placement="middle"
                />
              )}

              {/* Bottom Ad Banner */}
              {searchResults.length > 3 && (
                <EnhancedAdBanner 
                  type="google-adsense" 
                  className="mt-8"
                  adText="Recommended for you"
                  placement="bottom"
                />
              )}
            </div>
          )}

          {/* Features Section (when no search) */}
          {!hasSearched && (
            <div className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                  Why Choose FutureLinked ZA?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎓</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Student-Friendly</h3>
                    <p className="text-gray-600">Find bursaries, scholarships, internships, and graduate programs easily with dedicated search filters.</p>
                  </div>
                  
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Fresh Opportunities</h3>
                    <p className="text-gray-600">Only opportunities posted within the last 7 days - no old or expired listings.</p>
                  </div>
                  
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💯</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">100% Free</h3>
                    <p className="text-gray-600">No registration required, no hidden fees. Search and apply for free, always.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}