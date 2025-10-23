import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterSort from '../components/FilterSort';
import Breadcrumbs from '../components/Breadcrumbs';
import EnhancedAdBanner from '../components/EnhancedAdBanner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePageTracking, logSearch } from '../utils/analytics';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchLocation, setSearchLocation] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date');

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

  // Filter and sort logic
  useEffect(() => {
    let results = [...searchResults];

    // Apply filters
    if (filters.salaryMin) {
      results = results.filter(job => {
        if (!job.salary) return false;
        const salaryMatch = job.salary.match(/\d+/g);
        if (salaryMatch) {
          const salary = parseInt(salaryMatch[0]);
          return salary >= parseInt(filters.salaryMin);
        }
        return false;
      });
    }

    if (filters.workType && filters.workType !== 'all') {
      results = results.filter(job => {
        const text = `${job.title} ${job.description || ''}`.toLowerCase();
        if (filters.workType === 'remote') return text.includes('remote');
        if (filters.workType === 'onsite') return !text.includes('remote');
        if (filters.workType === 'hybrid') return text.includes('hybrid');
        return true;
      });
    }

    if (filters.datePosted && filters.datePosted !== 'all') {
      const now = new Date();
      results = results.filter(job => {
        if (!job.posted) return true;
        const posted = new Date(job.posted);
        const diffHours = (now - posted) / (1000 * 60 * 60);
        
        if (filters.datePosted === '24h') return diffHours <= 24;
        if (filters.datePosted === '3days') return diffHours <= 72;
        if (filters.datePosted === '7days') return diffHours <= 168;
        return true;
      });
    }

    // Apply sorting
    if (sortBy === 'date') {
      results.sort((a, b) => new Date(b.posted || 0) - new Date(a.posted || 0));
    } else if (sortBy === 'salary') {
      results.sort((a, b) => {
        const getSalary = (job) => {
          if (!job.salary) return 0;
          const match = job.salary.match(/\d+/g);
          return match ? parseInt(match[0]) : 0;
        };
        return getSalary(b) - getSalary(a);
      });
    }

    setFilteredResults(results);
  }, [searchResults, filters, sortBy]);

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
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "FutureLinked ZA",
              "description": "South Africa's premier job search platform for jobs, internships, bursaries, and graduate programs",
              "url": "https://futurelinked-za.co.za",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://futurelinked-za.co.za/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "FutureLinked ZA",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://futurelinked-za.co.za/logo.svg"
                }
              },
              "inLanguage": "en-ZA",
              "areaServed": "ZA"
            })
          }}
        />
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
              {/* Breadcrumbs */}
              <Breadcrumbs 
                items={[
                  { label: 'Search Results', href: null },
                  { label: searchQuery, href: null }
                ]}
              />

              {/* Top Ad Banner */}
              <EnhancedAdBanner 
                type="banner" 
                className="mb-8"
                adText="Sponsored Content"
                placement="top"
              />

              {/* Filter and Sort Controls */}
              <FilterSort
                onFilterChange={setFilters}
                onSortChange={setSortBy}
                resultsCount={filteredResults.length}
              />

              <SearchResults 
                results={filteredResults}
                loading={loading}
                loadingMore={loadingMore}
                query={searchQuery}
                totalResults={totalResults}
                currentCount={filteredResults.length}
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
            <>
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

              {/* Additional Content Section */}
              <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                      Your Gateway to Career Success in South Africa
                    </h2>
                    
                    <div className="prose prose-lg mx-auto text-gray-700 space-y-6">
                      <p>
                        FutureLinked ZA is South Africa's most comprehensive job search platform, specifically designed to help 
                        students, graduates, and job seekers find their dream opportunities. Whether you're looking for your 
                        first internship, searching for bursaries to fund your education, or seeking the next step in your 
                        career, we've got you covered.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-semibold mb-3 text-primary-600">For Students & Graduates</h3>
                          <ul className="space-y-2 text-sm">
                            <li>✓ Bursary and scholarship opportunities</li>
                            <li>✓ Graduate programs from top companies</li>
                            <li>✓ Internship positions across all industries</li>
                            <li>✓ Learnership programs for skills development</li>
                            <li>✓ Entry-level job opportunities</li>
                          </ul>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-xl font-semibold mb-3 text-primary-600">For Experienced Professionals</h3>
                          <ul className="space-y-2 text-sm">
                            <li>✓ Mid to senior-level positions</li>
                            <li>✓ Management and leadership roles</li>
                            <li>✓ Specialized technical positions</li>
                            <li>✓ Remote and flexible work opportunities</li>
                            <li>✓ Career advancement opportunities</li>
                          </ul>
                        </div>
                      </div>

                      <h3 className="text-2xl font-semibold mt-8 mb-4">How FutureLinked ZA Works</h3>
                      <p>
                        Our intelligent job search platform aggregates opportunities from verified sources including the Adzuna 
                        API and trusted South African job boards. We filter out outdated listings and only show you opportunities 
                        posted within the last 7 days, ensuring you never waste time on expired positions.
                      </p>
                      
                      <p>
                        Simply enter your search query and location, and our smart algorithm will instantly find relevant 
                        opportunities matching your criteria. No registration required, no hidden fees – just straightforward 
                        job searching that works.
                      </p>

                      <h3 className="text-2xl font-semibold mt-8 mb-4">Popular Search Categories</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                        <div className="bg-white p-4 rounded-lg text-center">
                          <span className="text-2xl mb-2 block">💼</span>
                          <p className="font-medium">IT & Technology</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <span className="text-2xl mb-2 block">📊</span>
                          <p className="font-medium">Finance & Accounting</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <span className="text-2xl mb-2 block">🏗️</span>
                          <p className="font-medium">Engineering</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <span className="text-2xl mb-2 block">📈</span>
                          <p className="font-medium">Marketing & Sales</p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-semibold mt-8 mb-4">Why Job Seekers Trust Us</h3>
                      <p>
                        Since our launch, we've helped thousands of South Africans find meaningful employment and educational 
                        opportunities. Our commitment to quality means every listing is fresh, relevant, and leads directly to 
                        legitimate opportunities. We don't clutter your search with outdated posts or spam – just real jobs 
                        from real employers.
                      </p>
                      
                      <div className="bg-blue-100 p-6 rounded-lg my-6">
                        <p className="text-center text-lg font-medium text-blue-800">
                          🚀 Start your job search journey today – your future is waiting!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}