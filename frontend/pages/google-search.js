import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleSearch from '../components/GoogleSearch';
import { usePageTracking } from '../utils/analytics';

export default function GoogleSearchPage() {
  usePageTracking();

  return (
    <>
      <Head>
        <title>Web Search - FutureLinked ZA | Search the Web for Jobs & Opportunities</title>
        <meta 
          name="description" 
          content="Search the entire web for jobs, bursaries, internships, and career opportunities in South Africa using Google Custom Search." 
        />
        <meta name="keywords" content="web search, job search, google search, south africa jobs, career search" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Web Search - FutureLinked ZA" />
        <meta property="og:description" content="Search the web for jobs and opportunities" />
        <meta property="og:url" content="https://futurelinked.netlify.app/google-search" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8 sm:py-12">
          {/* Page Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Web Search
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Search the entire web for jobs, bursaries, internships, and career opportunities
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by Google Custom Search
            </p>
          </div>

          {/* Google Custom Search */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
              <GoogleSearch />
            </div>

            {/* Search Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Search Tips
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Use specific keywords: "software engineer johannesburg", "accounting bursary 2025"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Add location: Include city names like "Cape Town", "Durban", "Pretoria"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Use quotes: "graduate program" to search for exact phrases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <span>Filter by site: Add "site:linkedin.com" or "site:careers24.com" to search specific sites</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a 
                href="/?q=bursary" 
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <h3 className="font-bold mb-1">🎓 Bursaries</h3>
                <p className="text-sm text-purple-100">Search our bursary database</p>
              </a>
              
              <a 
                href="/?q=internship" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <h3 className="font-bold mb-1">💼 Internships</h3>
                <p className="text-sm text-blue-100">Find internship opportunities</p>
              </a>
              
              <a 
                href="/?q=graduate+program" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <h3 className="font-bold mb-1">🎯 Graduate Programs</h3>
                <p className="text-sm text-green-100">Explore graduate opportunities</p>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
