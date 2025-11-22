import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterSort from '../components/FilterSort';
import Breadcrumbs from '../components/Breadcrumbs';
import CVUpload from '../components/CVUpload';
import SmartCVMatcher from '../components/SmartCVMatcher';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePageTracking, logSearch } from '../utils/analytics';

// Template Download Card Component
function TemplateDownloadCard({ title, icon, description, features }) {
  return (
    <Link href="/resources" className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden">
      <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-6 text-center">
        <div className="text-6xl mb-2">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2 mb-4">
          {features.map((feature, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="text-center">
          <span className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors">
            Download Free
          </span>
        </div>
      </div>
    </Link>
  );
}

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
  const [cvData, setCvData] = useState(null);
  const [isCVMatchSearch, setIsCVMatchSearch] = useState(false);

  // Page tracking
  usePageTracking();

  // Load CV data from localStorage on mount
  useEffect(() => {
    const savedCvData = localStorage.getItem('cvData');
    if (savedCvData) {
      setCvData(JSON.parse(savedCvData));
    }
  }, []);

  const handleSearch = async (query, location = '') => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchQuery(query);
    setSearchLocation(location);
    setCurrentPage(1);
    setHasSearched(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=1&limit=15&source=all`);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(searchLocation)}&page=${nextPage}&limit=15&source=all`);
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
          {/* Hero Section - CLEAN & SIMPLE */}
          <div className={`${hasSearched ? 'py-8' : 'py-24 md:py-36'} bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 transition-all duration-500 relative overflow-hidden`}>
            {/* Animated Background with Floating Icons */}
            {!hasSearched && (
              <>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                </div>
                {/* Floating Graduation Hats and Laptops */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🎓</div>
                  <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float" style={{animationDelay: '1s'}}>💻</div>
                  <div className="absolute bottom-32 left-1/4 text-5xl opacity-20 animate-float" style={{animationDelay: '2s'}}>🎓</div>
                  <div className="absolute top-1/3 right-10 text-6xl opacity-15 animate-float" style={{animationDelay: '3s'}}>📚</div>
                  <div className="absolute bottom-20 right-1/3 text-5xl opacity-20 animate-float" style={{animationDelay: '4s'}}>💼</div>
                  <div className="absolute top-1/4 left-1/3 text-4xl opacity-15 animate-float" style={{animationDelay: '5s'}}>💻</div>
                  <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float" style={{animationDelay: '1.5s'}}>🎓</div>
                  <div className="absolute top-1/2 right-1/4 text-4xl opacity-15 animate-float" style={{animationDelay: '2.5s'}}>📱</div>
                </div>
              </>
            )}
            
            <div className="container mx-auto px-4 text-center relative z-10">
              {!hasSearched && (
                <>
                  <div className="mb-16 animate-fadeIn max-w-5xl mx-auto">
                    {/* Clear Hierarchy */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      Find Your Dream Job — Faster.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-normal leading-relaxed">
                      Thousands of verified jobs, internships & bursaries. Updated daily.
                    </p>
                    
                    {/* Reduced Badges - Only 2 Essential */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-white text-sm md:text-base mb-12">
                      <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        <span className="font-medium">✔️ Updated Daily</span>
                      </span>
                      <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                        <span className="font-medium">✔️ No Sign-Up Required</span>
                      </span>
                    </div>
                  </div>
                </>
              )}
              
              <div className="max-w-4xl mx-auto">
                <SearchBar onSearch={handleSearch} loading={loading} />
                
                {/* Organized Sections - Clean & Professional */}
                {!hasSearched && (
                  <>
                    {/* SECTION 1 — Key Stats (Clean & Minimal) */}
                    <div className="mt-12 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/25 transition-all hover:bg-white/20 shadow-xl text-center">
                          <div className="text-5xl font-bold text-white mb-2">10K+</div>
                          <div className="text-sm text-white/90 font-medium">Active Jobs</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/25 transition-all hover:bg-white/20 shadow-xl text-center">
                          <div className="text-5xl font-bold text-white mb-2">500+</div>
                          <div className="text-sm text-white/90 font-medium">Companies</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/25 transition-all hover:bg-white/20 shadow-xl text-center">
                          <div className="text-5xl font-bold text-white mb-2">24/7</div>
                          <div className="text-sm text-white/90 font-medium">Live Updates</div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2 — Categories for Students */}
                    <div className="mt-16 animate-slideUp">
                      <h2 className="text-2xl text-white mb-8 font-bold text-center">
                        Categories for Students
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        <button
                          onClick={() => handleSearch('bursary', '')}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full py-4 px-6 font-semibold text-base transition-all hover:scale-105 shadow-lg"
                        >
                          🎓 Bursaries
                        </button>
                        <button
                          onClick={() => handleSearch('scholarship', '')}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full py-4 px-6 font-semibold text-base transition-all hover:scale-105 shadow-lg"
                        >
                          📝 Scholarships
                        </button>
                        <button
                          onClick={() => handleSearch('internship', '')}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full py-4 px-6 font-semibold text-base transition-all hover:scale-105 shadow-lg"
                        >
                          💼 Internships
                        </button>
                        <button
                          onClick={() => handleSearch('graduate program', '')}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full py-4 px-6 font-semibold text-base transition-all hover:scale-105 shadow-lg"
                        >
                          🎯 Graduate Programs
                        </button>
                      </div>
                    </div>

                    {/* SECTION 3 — Popular Careers */}
                    <div className="mt-16 animate-slideUp" style={{animationDelay: '0.1s'}}>
                      <h2 className="text-2xl text-white mb-8 font-bold text-center">
                        Popular Careers
                      </h2>
                      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                        {['IT Jobs', 'Graduate Programs', 'Teaching', 'Engineering', 'Marketing', 'Data Analyst'].map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSearch(term, '')}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white rounded-full py-3 px-6 font-semibold text-base transition-all hover:scale-105 shadow-lg"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* University Finder CTA in Hero */}
                    <div className="mt-16 animate-slideUp" style={{animationDelay: '0.2s'}}>
                      <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 max-w-3xl mx-auto border border-white/30 shadow-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="text-left flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">🎓 Looking for a University?</h3>
                            <p className="text-white/90 text-base">Explore 26+ SA universities & colleges with detailed program info</p>
                          </div>
                          <Link href="/universities" className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-base hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                            Find Universities →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {hasSearched && (
            <div className="container mx-auto px-4 py-8">
              {/* Breadcrumbs */}
              <div className="mb-6">
                <Breadcrumbs 
                  items={[
                    { label: 'Search Results', href: null },
                    { label: searchQuery, href: null }
                  ]}
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="mb-6">
                <FilterSort
                  onFilterChange={setFilters}
                  onSortChange={setSortBy}
                  resultsCount={filteredResults.length}
                />
              </div>

              {/* Search Results */}
              <div id="matched-jobs">
                <SearchResults 
                  results={filteredResults}
                  loading={loading}
                  loadingMore={loadingMore}
                  query={searchQuery}
                  totalResults={totalResults}
                  currentCount={filteredResults.length}
                  onLoadMore={handleLoadMore}
                  cvData={cvData}
                />
              </div>
            </div>
          )}

          {/* Features Section (when no search) */}
          {!hasSearched && (
            <>
              {/* Smart CV Search Section (restored) */}
              <div className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <div className="inline-block mb-4">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md">
                        🤖 AI-POWERED
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                      Smart CV Search
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      Upload your CV and let our AI find the perfect job matches for you
                    </p>
                  </div>
                  <div className="max-w-4xl mx-auto">
                    <SmartCVMatcher />
                  </div>
                </div>
              </div>

              {/* Quick Features Overview */}
              <div className="py-20 bg-gradient-to-br from-white to-gray-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                      Why Choose FutureLinked ZA?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Everything you need to find and land your dream job
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 text-center transform hover:scale-105 transition-all shadow-md hover:shadow-xl border border-gray-100">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <span className="text-4xl">⚡</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Lightning Fast Search</h3>
                      <p className="text-gray-600 leading-relaxed">Find thousands of jobs, internships, and bursaries in seconds with our powerful search</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 text-center transform hover:scale-105 transition-all shadow-md hover:shadow-xl border border-gray-100">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <span className="text-4xl">✅</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Always Up-to-Date</h3>
                      <p className="text-gray-600 leading-relaxed">Only the freshest opportunities updated daily, no outdated listings</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 text-center transform hover:scale-105 transition-all shadow-md hover:shadow-xl border border-gray-100">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <span className="text-4xl">💯</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Completely Free</h3>
                      <p className="text-gray-600 leading-relaxed">No registration required, no hidden fees, just free access forever</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CV Templates Section - User Friendly */}
              <div className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16 animate-fadeIn">
                    <div className="inline-block mb-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md">
                        🎁 FREE RESOURCES
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
                      Professional Templates
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                      Download free, professionally-designed templates to boost your applications
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
                    <TemplateDownloadCard
                      title="Professional CV Template"
                      icon="📝"
                      description="ATS-friendly CV template used by successful job seekers"
                      features={["Clean layout", "Easy to customize", "2-page format"]}
                    />
                    <TemplateDownloadCard
                      title="Cover Letter Template"
                      icon="✉️"
                      description="Compelling cover letter template that gets responses"
                      features={["Professional tone", "Customizable", "Proven format"]}
                    />
                    <TemplateDownloadCard
                      title="Bursary Motivation Letter"
                      icon="🎓"
                      description="Win bursaries with this motivation letter template"
                      features={["Student-focused", "Persuasive structure", "Sample content"]}
                    />
                  </div>
                  
                  <div className="text-center">
                    <Link href="/resources" className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <span>📥 Download All Templates Free</span>
                      <span className="text-xl">→</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Career Tips Section - User Friendly */}
              <div className="py-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                      Career Success Guides
                    </h2>
                    <p className="text-xl text-white opacity-90 max-w-2xl mx-auto leading-relaxed">
                      Expert advice and proven strategies to help you succeed
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Link href="/articles/cv-writing-guide" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1">
                      <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">📝</div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">CV Writing Guide</h3>
                      <p className="text-gray-600 mb-5 leading-relaxed">Learn how to create a professional CV that stands out to employers</p>
                      <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                        Read More
                        <span className="text-lg">→</span>
                      </span>
                    </Link>
                    
                    <Link href="/articles/interview-guide" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1">
                      <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">💼</div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">Interview Mastery</h3>
                      <p className="text-gray-600 mb-5 leading-relaxed">Master interview techniques and answer questions with confidence</p>
                      <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                        Read More
                        <span className="text-lg">→</span>
                      </span>
                    </Link>
                    
                    <Link href="/articles/salary-negotiation" className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1">
                      <div className="text-6xl mb-5 group-hover:scale-110 transition-transform">💰</div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">Salary Negotiation</h3>
                      <p className="text-gray-600 mb-5 leading-relaxed">Get the salary you deserve with proven negotiation strategies</p>
                      <span className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                        Read More
                        <span className="text-lg">→</span>
                      </span>
                    </Link>
                  </div>
                  
                  <div className="text-center mt-12">
                    <Link href="/resources" className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      View All Career Resources →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Student-Focused Section */}
              <div className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5">
                      🎓 Built for South African Students
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      We understand the unique challenges of finding opportunities in South Africa
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-4xl">🎓</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Bursaries & Scholarships</h3>
                      <p className="text-gray-600 leading-relaxed">Access hundreds of funding opportunities from top SA companies and institutions</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-4xl">💼</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Internships & Learnerships</h3>
                      <p className="text-gray-600 leading-relaxed">Find hands-on experience opportunities to kickstart your career journey</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-4xl">�</span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Graduate Programs</h3>
                      <p className="text-gray-600 leading-relaxed">Join structured programs at leading companies and build your professional network</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* University Finder Section - PROMINENT */}
              <div className="py-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center mb-12">
                    <div className="inline-block mb-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md border border-white/30">
                        🎓 NEW FEATURE
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      Find Your Perfect University
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
                      Explore 26+ South African universities and colleges. Compare programs, fees, requirements, and more.
                    </p>
                    
                    <Link href="/universities" className="inline-flex items-center gap-3 bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1">
                      <span className="text-3xl">🎓</span>
                      <span>Explore Universities Now</span>
                      <span className="text-2xl">→</span>
                    </Link>
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-4xl mb-3">🏛️</div>
                      <div className="text-2xl font-bold text-white mb-2">26+</div>
                      <div className="text-sm text-white/90">Universities & Colleges</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-4xl mb-3">📚</div>
                      <div className="text-2xl font-bold text-white mb-2">100+</div>
                      <div className="text-sm text-white/90">Courses & Programs</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-4xl mb-3">💰</div>
                      <div className="text-2xl font-bold text-white mb-2">Fees</div>
                      <div className="text-sm text-white/90">Compare Tuition Costs</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center">
                      <div className="text-4xl mb-3">📊</div>
                      <div className="text-2xl font-bold text-white mb-2">APS</div>
                      <div className="text-sm text-white/90">Entry Requirements</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Content Section */}
              <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
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