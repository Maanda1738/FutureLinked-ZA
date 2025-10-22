import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, Target, Award, Zap } from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>About FutureLinked ZA - Our Mission & Vision</title>
        <meta name="description" content="Learn about FutureLinked ZA's mission to connect South Africans with verified job opportunities through intelligent search technology." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About FutureLinked ZA
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Empowering South Africans to find their future through intelligent job search technology
              </p>
            </div>
          </div>

          {/* About FutureLinked */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">About FutureLinked ZA</h2>
                
                <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
                  <p className="text-lg leading-relaxed">
                    FutureLinked is a smart job search assistant created by <strong className="text-gray-900">Maanda Netshisumbewa</strong>, 
                    designed to make finding opportunities in South Africa simple, fast, and stress-free.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Powered by intelligent automation and the Adzuna API, FutureLinked scans top company websites 
                    and job boards in real time to bring you the most relevant openings — all in one convenient place.
                  </p>

                  <p className="text-lg leading-relaxed">
                    No sign-ups, no downloads, no complicated features. Just type the kind of job you're looking for, 
                    press Search, and let our AI-powered robot find the latest positions that match your interests.
                  </p>

                  <p className="text-lg leading-relaxed">
                    Whether you're a student seeking an internship, a graduate exploring career paths, or a professional 
                    ready for the next step, FutureLinked helps you connect directly to verified job portals and real 
                    opportunities across South Africa.
                  </p>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200 my-8">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                      <Target className="h-7 w-7 text-blue-600" />
                      Our Mission
                    </h3>
                    <p className="text-lg leading-relaxed text-gray-700">
                      To bridge the gap between talent and opportunity through innovation, accessibility, and smart technology. 
                      FutureLinked's mission is to make job searching in South Africa effortless, efficient, and empowering for everyone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                How FutureLinked ZA Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Intelligent Search</h3>
                  <p className="text-gray-600">
                    Our AI-powered search robot scans multiple job boards, company career pages, 
                    and educational portals in real-time to find the most relevant opportunities.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Verified Sources</h3>
                  <p className="text-gray-600">
                    We only aggregate from trusted sources like official company websites, 
                    established job boards, and verified educational institutions.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Direct Connection</h3>
                  <p className="text-gray-600">
                    Skip the middleman. We connect you directly to the employer's application page, 
                    ensuring you apply through official channels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Why Choose FutureLinked ZA?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Get results in seconds, not hours</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="font-semibold mb-2">No Registration</h3>
                  <p className="text-gray-600 text-sm">Search and apply without creating accounts</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">🇿🇦</div>
                  <h3 className="font-semibold mb-2">Local Focus</h3>
                  <p className="text-gray-600 text-sm">Curated specifically for South African job seekers</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="font-semibold mb-2">Verified Only</h3>
                  <p className="text-gray-600 text-sm">All opportunities from trusted, verified sources</p>
                </div>
              </div>
            </div>
          </div>

          {/* Creator */}
          <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Created & Developed By</h2>
              
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8 border border-blue-100">
                {/* Professional Photo */}
                <div className="mb-8 relative">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-blue-500 ring-offset-4 shadow-xl">
                    <Image 
                      src="/maanda-profile.png" 
                      alt="Maanda Netshisumbewa - Founder of FutureLinked ZA" 
                      width={192}
                      height={192}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-2 text-gray-900">Maanda Netshisumbewa</h3>
                <p className="text-xl text-blue-600 font-semibold mb-6">Founder & Developer</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    The visionary behind FutureLinked ZA, dedicated to using technology to solve real problems 
                    and create meaningful opportunities for South Africans. Through innovation and smart automation, 
                    Maanda is committed to making job searching accessible, efficient, and empowering.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 text-base text-gray-600 font-medium">
                  <Award className="h-6 w-6 text-blue-600" />
                  <span>Building South Africa's Future, One Opportunity at a Time</span>
                </div>
              </div>

              <div className="text-2xl mb-4">🇿�</div>
              <p className="text-gray-600 text-lg">
                Proudly Made in South Africa, for South Africa
              </p>
              <p className="text-gray-500 mt-2">
                Powered by innovation, driven by purpose ❤️
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}