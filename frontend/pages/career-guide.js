import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CareerGuide() {
  return (
    <>
      <Head>
        <title>Career Guide | Job Search Tips & Resume Advice | FutureLinked ZA</title>
        <meta name="description" content="Expert career advice, job search strategies, and resume writing tips for South African professionals. Learn how to land your dream job." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Career Success Guide
            </h1>
            <p className="text-xl text-gray-600">
              Expert tips and strategies to accelerate your career in South Africa
            </p>
          </div>

          {/* Resume Writing Tips */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📝 Resume Writing Best Practices</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">1. Tailor Your Resume to Each Job</h3>
                <p className="text-gray-700 leading-relaxed">
                  Don't send the same resume to every employer. Review the job description carefully and 
                  adjust your resume to highlight relevant skills and experience. Use keywords from the 
                  job posting to pass Applicant Tracking Systems (ATS).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">2. Use a Professional Format</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Keep your resume clean and easy to read:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Use a simple, professional font (Arial, Calibri, or Times New Roman)</li>
                  <li>Font size between 10-12 points</li>
                  <li>Consistent formatting throughout</li>
                  <li>Clear section headings</li>
                  <li>Bullet points for easy scanning</li>
                  <li>1-inch margins on all sides</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">3. Start with a Strong Summary</h3>
                <p className="text-gray-700 leading-relaxed">
                  Write a compelling 3-4 line professional summary at the top of your resume. Highlight 
                  your years of experience, key skills, and career goals. Make it specific to the role 
                  you're applying for.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">4. Quantify Your Achievements</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Instead of listing duties, showcase achievements with numbers:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">❌ <span className="line-through">Managed social media accounts</span></p>
                  <p className="text-gray-700">✅ <strong>Increased social media engagement by 150% across 5 platforms, growing followers from 2K to 15K in 6 months</strong></p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">5. Include Relevant Skills</h3>
                <p className="text-gray-700 leading-relaxed">
                  Create a skills section with both technical and soft skills relevant to the position. 
                  Include software proficiency, languages, certifications, and key competencies.
                </p>
              </div>
            </div>
          </div>

          {/* Job Search Strategies */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Effective Job Search Strategies</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Network Strategically</h3>
                <p className="text-gray-700 leading-relaxed">
                  Over 70% of jobs are filled through networking. Connect with professionals on LinkedIn, 
                  attend industry events, join professional associations, and reach out to alumni from 
                  your university. Don't be afraid to ask for informational interviews.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Use Multiple Job Boards</h3>
                <p className="text-gray-700 leading-relaxed">
                  Don't rely on just one platform. Use FutureLinked ZA for comprehensive search, but also 
                  check company websites directly, LinkedIn Jobs, PNet, CareerJunction, and Indeed. Set 
                  up job alerts to be notified of new opportunities.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Research Companies Thoroughly</h3>
                <p className="text-gray-700 leading-relaxed">
                  Before applying, research the company's culture, values, recent news, and employee 
                  reviews. This helps you determine if it's a good fit and prepares you for interviews. 
                  Check Glassdoor, company social media, and their website's About/Career pages.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Follow Up Professionally</h3>
                <p className="text-gray-700 leading-relaxed">
                  After applying, wait 1-2 weeks and send a polite follow-up email expressing continued 
                  interest. After interviews, send thank-you notes within 24 hours. This shows 
                  professionalism and keeps you top of mind.
                </p>
              </div>
            </div>
          </div>

          {/* Interview Preparation */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💼 Interview Preparation Guide</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Before the Interview</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Research the company, its products/services, and recent news</li>
                  <li>Review the job description and match your experience to requirements</li>
                  <li>Prepare answers to common interview questions</li>
                  <li>Prepare questions to ask the interviewer</li>
                  <li>Plan your outfit (professional and appropriate for the company culture)</li>
                  <li>Test your technology if it's a virtual interview</li>
                  <li>Print extra copies of your resume</li>
                  <li>Plan your route and aim to arrive 10-15 minutes early</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Common Interview Questions</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">"Tell me about yourself"</p>
                    <p className="text-gray-700">
                      Give a concise 2-minute overview of your professional background, key achievements, 
                      and why you're interested in this role. Focus on relevant experience.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">"What are your strengths and weaknesses?"</p>
                    <p className="text-gray-700">
                      Choose strengths relevant to the job. For weaknesses, mention something you're 
                      actively working to improve and explain the steps you're taking.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">"Why do you want this job?"</p>
                    <p className="text-gray-700">
                      Show enthusiasm and knowledge about the company. Explain how the role aligns with 
                      your career goals and how your skills will benefit the organization.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">The STAR Method</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Use this framework to answer behavioral questions:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="font-bold text-indigo-600 mr-3">S</span>
                    <div>
                      <p className="font-semibold text-gray-900">Situation</p>
                      <p className="text-gray-700">Describe the context</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-indigo-600 mr-3">T</span>
                    <div>
                      <p className="font-semibold text-gray-900">Task</p>
                      <p className="text-gray-700">Explain the challenge or responsibility</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-indigo-600 mr-3">A</span>
                    <div>
                      <p className="font-semibold text-gray-900">Action</p>
                      <p className="text-gray-700">Detail the steps you took</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-indigo-600 mr-3">R</span>
                    <div>
                      <p className="font-semibold text-gray-900">Result</p>
                      <p className="text-gray-700">Share the outcome and what you learned</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Negotiation */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white mb-12">
            <h2 className="text-3xl font-bold mb-6">💰 Salary Negotiation Tips</h2>
            
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                <strong>1. Research Market Rates:</strong> Use PayScale, Glassdoor, and industry reports 
                to understand typical salaries for your role and experience level in South Africa.
              </p>
              
              <p className="text-lg leading-relaxed">
                <strong>2. Let Them Make the First Offer:</strong> When asked about salary expectations, 
                try to defer by saying "I'd like to learn more about the role first" or "I'm sure we can 
                reach a fair number."
              </p>
              
              <p className="text-lg leading-relaxed">
                <strong>3. Consider the Full Package:</strong> Salary is just one part. Factor in benefits, 
                bonuses, stock options, remote work, professional development, and work-life balance.
              </p>
              
              <p className="text-lg leading-relaxed">
                <strong>4. Be Professional:</strong> Express enthusiasm for the role while negotiating. 
                Frame it as "Based on my research and experience, I was hoping for something in the range of..."
              </p>
              
              <p className="text-lg leading-relaxed">
                <strong>5. Get It in Writing:</strong> Once you've agreed on terms, request a written offer 
                letter before resigning from your current position.
              </p>
            </div>
          </div>

          {/* Career Development */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">📈 Continuous Career Development</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Keep Learning</h3>
                <p className="text-gray-700 leading-relaxed">
                  Invest in continuous education through online courses (Coursera, Udemy, LinkedIn Learning), 
                  professional certifications, workshops, and industry conferences. Stay updated on trends 
                  in your field.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Build Your Personal Brand</h3>
                <p className="text-gray-700 leading-relaxed">
                  Create a strong LinkedIn profile, share industry insights, write articles, and engage 
                  with professional content. Position yourself as a thought leader in your field.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Seek Mentorship</h3>
                <p className="text-gray-700 leading-relaxed">
                  Find mentors who can provide guidance, advice, and connections. Don't hesitate to reach 
                  out to professionals you admire. Most people are willing to help.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">Set Career Goals</h3>
                <p className="text-gray-700 leading-relaxed">
                  Define short-term (1 year) and long-term (5 years) career goals. Create an action plan 
                  with specific steps to achieve them. Review and adjust regularly.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
