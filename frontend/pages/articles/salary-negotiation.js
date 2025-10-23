import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SalaryNegotiation() {
  return (
    <>
      <Head>
        <title>Salary Negotiation Guide for South Africa | FutureLinked ZA</title>
        <meta name="description" content="Learn how to negotiate your salary confidently. Includes average SA salaries, negotiation scripts, and when to discuss money." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/resources" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>

            <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
                  Salary Negotiation
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Negotiating Your Salary: A South African Guide
                </h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                  <span>•</span>
                  <span>Updated October 2025</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Salary negotiation can feel uncomfortable, but it's a critical skill that can significantly 
                  impact your lifetime earnings. Here's how to negotiate confidently and professionally in 
                  South Africa's job market.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">When to Discuss Salary</h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                  <p className="text-yellow-800 font-medium">Golden Rule:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Let the employer bring up salary first. If asked early, say: "I'd prefer to learn more about 
                    the role and how I can add value before discussing compensation. What's the salary range for this position?"
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Best Times to Negotiate:</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>After receiving an offer</strong> - You have the most leverage</li>
                  <li><strong>During performance reviews</strong> - When your value is being assessed</li>
                  <li><strong>When taking on new responsibilities</strong> - Justify with added value</li>
                  <li><strong>After completing a major project</strong> - Demonstrate your impact</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Average Salaries in South Africa (2025)</h2>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Entry-Level Positions</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Junior Developer</p>
                      <p className="text-green-600 font-bold">R15,000 - R25,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Graduate Trainee</p>
                      <p className="text-green-600 font-bold">R8,000 - R15,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Admin Assistant</p>
                      <p className="text-green-600 font-bold">R8,000 - R12,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Junior Accountant</p>
                      <p className="text-green-600 font-bold">R12,000 - R18,000/month</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Mid-Level Positions (3-5 years experience)</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Software Developer</p>
                      <p className="text-green-600 font-bold">R30,000 - R50,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Marketing Manager</p>
                      <p className="text-green-600 font-bold">R35,000 - R55,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Accountant (CA)</p>
                      <p className="text-green-600 font-bold">R40,000 - R60,000/month</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium text-gray-800">Project Manager</p>
                      <p className="text-green-600 font-bold">R35,000 - R60,000/month</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How to Research Your Worth</h2>
                
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Check salary surveys: <strong>PayScale SA</strong>, <strong>Salary Explorer</strong>, <strong>Indeed Salary Tool</strong></li>
                  <li>Ask recruiters for market rates in your field</li>
                  <li>Network with professionals in similar roles (LinkedIn)</li>
                  <li>Review job postings with salary ranges</li>
                  <li>Consider: location, company size, industry, your experience level</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Negotiation Scripts That Work</h2>
                
                <div className="space-y-6 mb-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-semibold text-blue-800 mb-2">Scenario: They offer below your expectation</p>
                    <p className="text-sm text-gray-700 italic">
                      "Thank you for the offer. I'm excited about the opportunity. Based on my research of similar 
                      roles and my [X years] experience in [skill], I was expecting something closer to [R amount]. 
                      Is there flexibility in the salary?"
                    </p>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="font-semibold text-green-800 mb-2">Scenario: You have another offer</p>
                    <p className="text-sm text-gray-700 italic">
                      "I've received another offer at [R amount], but your company is my preference because [reason]. 
                      Would you be able to match or come closer to that figure?"
                    </p>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                    <p className="font-semibold text-purple-800 mb-2">Scenario: Asking for a raise</p>
                    <p className="text-sm text-gray-700 italic">
                      "I've been with the company for [X time] and have consistently [achievements]. Given my 
                      contributions and market rates for this role, I'd like to discuss increasing my salary to 
                      [R amount]. Can we schedule a time to discuss this?"
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Beyond Salary: Total Compensation</h2>
                
                <p className="text-gray-700 mb-4">
                  If salary is non-negotiable, negotiate other benefits:
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Financial Benefits:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Performance bonuses</li>
                      <li>• Sign-on bonus</li>
                      <li>• Annual increases guarantee</li>
                      <li>• Profit sharing</li>
                      <li>• Retirement contributions</li>
                      <li>• Medical aid/insurance</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Lifestyle Benefits:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Remote work options</li>
                      <li>• Flexible hours</li>
                      <li>• Extra leave days</li>
                      <li>• Professional development budget</li>
                      <li>• Gym membership</li>
                      <li>• Cell phone/data allowance</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Common Mistakes to Avoid</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <ul className="text-red-700 space-y-3">
                    <li className="flex items-start">
                      <span className="font-bold mr-2">✗</span>
                      <span><strong>Accepting the first offer immediately</strong> - Always negotiate, even if it's good</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">✗</span>
                      <span><strong>Lying about other offers</strong> - Can backfire badly</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">✗</span>
                      <span><strong>Making it personal</strong> - Focus on market value, not personal needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">✗</span>
                      <span><strong>Being apologetic</strong> - Negotiate confidently and professionally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-bold mr-2">✗</span>
                      <span><strong>Not getting it in writing</strong> - Verbal promises don't count</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold mb-3">Negotiation Checklist</h3>
                  <ul className="space-y-2">
                    <li>☐ Research market rates for your role</li>
                    <li>☐ Know your minimum acceptable salary</li>
                    <li>☐ Prepare your achievements/value proposition</li>
                    <li>☐ Practice your negotiation script</li>
                    <li>☐ Be ready to walk away if needed</li>
                    <li>☐ Stay professional and positive throughout</li>
                    <li>☐ Get final offer in writing before accepting</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Find Your Next Opportunity?</h3>
                  <p className="text-gray-700 mb-4">
                    Now that you know how to negotiate, start searching for jobs that match your worth.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    🔍 Search Jobs Now
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
