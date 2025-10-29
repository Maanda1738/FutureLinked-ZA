import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Diagnostics() {
  const [apiTest, setApiTest] = useState(null);
  const [envVars, setEnvVars] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test API connection
    const testAPI = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'NOT SET';
        setEnvVars({
          NEXT_PUBLIC_API_URL: apiUrl,
          NEXT_PUBLIC_GOOGLE_ADSENSE_ID: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || 'NOT SET'
        });

        const response = await fetch(`${apiUrl}/search?q=test&location=south+africa&page=1`);
        const data = await response.json();
        
        setApiTest({
          status: response.status,
          ok: response.ok,
          success: data.success,
          resultsCount: data.results ? data.results.length : 0,
          total: data.total || 0,
          error: data.error || null
        });
      } catch (error) {
        setApiTest({
          status: 'ERROR',
          ok: false,
          error: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  return (
    <>
      <Head>
        <title>System Diagnostics - FutureLinked ZA</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">System Diagnostics</h1>

          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
            <div className="space-y-2 font-mono text-sm">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex gap-4">
                  <span className="font-bold text-blue-600">{key}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API Test */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
            {loading ? (
              <p className="text-gray-600">Testing API connection...</p>
            ) : apiTest ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Status:</span>
                  <span className={`px-3 py-1 rounded ${apiTest.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {apiTest.ok ? '✅ Connected' : '❌ Failed'}
                  </span>
                </div>
                <div><span className="font-bold">HTTP Status:</span> {apiTest.status}</div>
                <div><span className="font-bold">Success:</span> {String(apiTest.success)}</div>
                <div><span className="font-bold">Results Count:</span> {apiTest.resultsCount}</div>
                <div><span className="font-bold">Total Available:</span> {apiTest.total}</div>
                {apiTest.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <span className="font-bold text-red-800">Error:</span>
                    <pre className="mt-2 text-sm text-red-700">{apiTest.error}</pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-600">Failed to test API</p>
            )}
          </div>

          {/* Browser Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Browser Information</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-bold">User Agent:</span> {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
              <div><span className="font-bold">Current URL:</span> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
