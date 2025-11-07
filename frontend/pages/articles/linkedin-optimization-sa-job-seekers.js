import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Clock, Linkedin, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LinkedInOptimizationSA() {
  return (
    <>
      <Head>
        <title>LinkedIn Profile Optimization for South African Job Seekers | FutureLinked ZA</title>
        <meta name="description" content="Complete guide to optimizing your LinkedIn profile for the South African job market. Attract recruiters, build your network, and land interviews." />
        <meta name="keywords" content="linkedin south africa, linkedin profile optimization, linkedin tips, professional networking, job search linkedin, recruiter tips" />
        
        {/* Open Graph */}
        <meta property="og:title" content="LinkedIn Profile Optimization for South African Job Seekers" />
        <meta property="og:description" content="Transform your LinkedIn into a powerful job-hunting tool with expert strategies" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://futurelinked-za.co.za/articles/linkedin-optimization-sa-job-seekers" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LinkedIn Optimization for SA Job Seekers" />
        <meta name="twitter:description" content="Master LinkedIn to attract recruiters and land jobs in South Africa" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  Career Advice
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  LinkedIn Profile Optimization for South African Job Seekers
                </h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>10 min read</span>
                  </div>
                  <span>•</span>
                  <span>Published January 5, 2025</span>
                  <span>•</span>
                  <span>By Nomsa Khumalo, Digital Career Coach</span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  In South Africa's competitive job market, having a strong LinkedIn profile is no longer optional—it's essential. 
                  Recruiters use LinkedIn as their primary tool to find candidates, and 87% of hiring managers check candidates' 
                  profiles before interviews. This guide will show you exactly how to optimize your LinkedIn profile to attract 
                  recruiters, build meaningful connections, and land your dream job.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 mb-8">
                  <p className="text-blue-800 font-medium flex items-center gap-2">
                    <Linkedin className="h-5 w-5" />
                    LinkedIn in South Africa
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    Over 9 million South Africans are on LinkedIn. Recruiters search the platform daily for candidates. 
                    A complete, optimized profile makes you 40x more likely to be found and contacted for opportunities.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">The LinkedIn Profile Checklist: What Recruiters Look For</h2>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Profile Completeness Score (Aim for 100%):</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Professional photo</strong> (Not a selfie, no sunglasses, clear face)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Compelling headline</strong> (Not just "Student at X University")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Custom background banner</strong> (Shows professionalism)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Summary/About section</strong> (Your elevator pitch)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Experience with descriptions</strong> (Not just job titles)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Education details</strong> (University, degree, achievements)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Skills (minimum 5)</strong> (Recruiters search by skills)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Custom LinkedIn URL</strong> (linkedin.com/in/yourname)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>50+ connections</strong> (Shows you're active and engaged)</span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Profile Photo: Your First Impression</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3">✓ DO:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Professional headshot or smart casual</li>
                      <li>• Clear, high-resolution image</li>
                      <li>• Smiling, approachable expression</li>
                      <li>• Plain or blurred background</li>
                      <li>• Face takes up 60% of frame</li>
                      <li>• Recent photo (within 2 years)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-3">✗ DON'T:</h3>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Selfies or casual snapshots</li>
                      <li>• Sunglasses, hats, or filters</li>
                      <li>• Group photos (crop yourself out)</li>
                      <li>• Party or vacation photos</li>
                      <li>• Pixelated or blurry images</li>
                      <li>• No photo at all (profiles with photos get 21x more views!)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-blue-800 font-medium">💡 Pro Tip:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Can't afford professional photos? Ask a friend with a decent smartphone. Stand near a window for 
                    natural light, wear professional attire, and take multiple shots to choose from.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Headline: Your 120-Character Sales Pitch</h2>
                
                <p className="text-gray-700 mb-4">
                  Your headline appears in search results and is crucial for discoverability. Don't waste it on just 
                  your job title or university.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="font-semibold text-red-800 mb-2">❌ Bad Examples (Generic, Boring):</p>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• "Student at University of Cape Town"</li>
                      <li>• "Seeking opportunities"</li>
                      <li>• "Unemployed Graduate"</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="font-semibold text-green-800 mb-2">✅ Great Examples (Specific, Value-Driven):</p>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• "Software Engineering Graduate | Python, React, SQL | Open to Full Stack Developer Roles"</li>
                      <li>• "Aspiring Data Scientist | Machine Learning & Analytics | BSc Computer Science at Wits"</li>
                      <li>• "Marketing Professional | Digital Strategy & Content Creation | Helping Brands Grow"</li>
                      <li>• "Chartered Accountant Trainee | SAICA Articles at Deloitte | Audit & Financial Reporting"</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Formula for a Powerful Headline:</h3>
                  <p className="text-gray-700 mb-2 font-mono bg-white p-3 rounded text-sm">
                    [Your Role/Status] | [3 Key Skills] | [Value Proposition or Goal]
                  </p>
                  <p className="text-gray-600 text-sm">
                    Include keywords that recruiters search for in your industry. For example, if you're in IT, 
                    include specific languages/frameworks (Java, Python, React) rather than generic terms.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. About/Summary Section: Tell Your Story</h2>
                
                <p className="text-gray-700 mb-4">
                  This is your chance to stand out from other candidates. Write in first person, be authentic, 
                  and showcase your personality.
                </p>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Winning Structure (3 Paragraphs):</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-blue-800">Paragraph 1: Who You Are</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Start with your current position or recent achievement. Make it engaging.
                      </p>
                      <p className="text-gray-600 text-xs italic mt-2">
                        "I'm a passionate software developer with 3 years of experience building scalable web applications. 
                        I love solving complex problems with clean, efficient code."
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-green-800">Paragraph 2: What You've Done (Achievements)</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Quantify your impact. Use numbers, percentages, results.
                      </p>
                      <p className="text-gray-600 text-xs italic mt-2">
                        "In my current role at XYZ Corp, I led a team of 5 developers to rebuild our e-commerce platform, 
                        resulting in a 40% increase in page load speed and 25% boost in conversions."
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-purple-800">Paragraph 3: What You're Looking For</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Be clear about your goals and how others can reach you.
                      </p>
                      <p className="text-gray-600 text-xs italic mt-2">
                        "I'm currently open to full-stack developer roles in Cape Town or remote positions. 
                        Let's connect if you're building innovative products! 📧 yourname@email.com"
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Experience Section: Show, Don't Just Tell</h2>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                  <p className="text-yellow-800 font-medium">⚠️ Common Mistake:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Listing duties instead of achievements. Recruiters want to know WHAT YOU ACCOMPLISHED, 
                    not just what your responsibilities were.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">❌ Weak (Just Duties):</h4>
                    <p className="text-gray-700 text-sm">
                      "Responsible for managing social media accounts and creating content"
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Strong (Achievement-Focused):</h4>
                    <p className="text-gray-700 text-sm">
                      "Grew Instagram following from 2k to 15k in 6 months through strategic content planning 
                      and engagement campaigns, resulting in 30% increase in website traffic"
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Action Verb Starters for Bullet Points:</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <p className="font-semibold mb-2">Leadership:</p>
                      <p>Led, Managed, Coordinated, Directed, Supervised, Mentored</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Achievement:</p>
                      <p>Achieved, Delivered, Exceeded, Improved, Increased, Reduced</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Creation:</p>
                      <p>Developed, Built, Designed, Created, Implemented, Launched</p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Skills Section: Get Found by Recruiters</h2>
                
                <p className="text-gray-700 mb-4">
                  Recruiters search LinkedIn by keywords and skills. Add at least 10-15 relevant skills, 
                  prioritizing the top 3 that you want to be known for.
                </p>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Skill Strategy by Career Stage:</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-800">For Students/Graduates:</h4>
                      <p className="text-gray-700 text-sm">
                        List: Programming languages, software tools, methodologies, soft skills<br/>
                        Example: Python, Java, SQL, Project Management, Microsoft Excel, Critical Thinking, Team Collaboration
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-800">For Professionals:</h4>
                      <p className="text-gray-700 text-sm">
                        List: Industry-specific skills, certifications, leadership abilities<br/>
                        Example: Financial Modeling, IFRS, SAP, Strategic Planning, Change Management, Stakeholder Engagement
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                  <p className="text-purple-800 font-medium">💡 Endorsement Hack:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Endorse 5-10 connections daily. Many will reciprocate and endorse you back. 
                    More endorsements = higher ranking in search results.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  6. Building Your Network: Quality Over Quantity
                </h2>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Who to Connect With:</h3>
                  <ol className="text-gray-700 space-y-2 list-decimal pl-5">
                    <li><strong>Alumni from your university</strong> (shared connection makes it easier)</li>
                    <li><strong>People in your target industry</strong> (even if you don't know them personally)</li>
                    <li><strong>Recruiters</strong> at companies you want to work for</li>
                    <li><strong>Colleagues and classmates</strong> (current and past)</li>
                    <li><strong>Industry leaders and thought leaders</strong> (follow for insights)</li>
                  </ol>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">How to Send Connection Requests (Without Being Spammy):</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Template 1: Alumni Connection</h4>
                    <p className="text-gray-600 text-sm italic">
                      "Hi [Name], I'm a fellow [University] graduate (Class of 2024) pursuing a career in [field]. 
                      I'd love to connect and learn from your experience at [their company]. Looking forward to connecting!"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Template 2: Industry Professional</h4>
                    <p className="text-gray-600 text-sm italic">
                      "Hi [Name], I came across your profile while researching [industry/company]. Your work in [specific area] 
                      is really impressive. I'd love to connect and stay updated on industry trends!"
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Template 3: Recruiter Connection</h4>
                    <p className="text-gray-600 text-sm italic">
                      "Hi [Name], I see you recruit for [field] roles at [Company]. I'm a [your title] with experience in 
                      [skills]. I'd love to connect and learn more about opportunities at [Company]."
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  7. Staying Active: The LinkedIn Algorithm Loves Engagement
                </h2>
                
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Weekly Activity Checklist:</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Post 1-2 times per week:</strong> Share industry insights, career updates, or helpful content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Comment on 5-10 posts daily:</strong> Thoughtful comments (not just "Great post!")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Engage with your network:</strong> Like, comment, and share their content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Send 5-10 connection requests:</strong> With personalized messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Update your profile:</strong> Add new skills, certifications, or achievements monthly</span>
                    </li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Content Ideas That Get Engagement:</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Share a career lesson you learned</li>
                  <li>Celebrate a work milestone or achievement</li>
                  <li>Post about a project you're working on</li>
                  <li>Share industry news with your perspective</li>
                  <li>Ask for advice or recommendations</li>
                  <li>Congratulate connections on their achievements</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">LinkedIn Job Search Features You Should Use</h2>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <ol className="text-gray-700 space-y-3 list-decimal pl-5">
                    <li>
                      <strong>Turn on "Open to Work" badge:</strong> Let recruiters know you're actively looking 
                      (visible to recruiters only or publicly)
                    </li>
                    <li>
                      <strong>Set up job alerts:</strong> Get notified when relevant jobs are posted
                    </li>
                    <li>
                      <strong>Use "Easy Apply":</strong> Apply to multiple jobs quickly with your LinkedIn profile
                    </li>
                    <li>
                      <strong>Follow target companies:</strong> See their updates and job postings in your feed
                    </li>
                    <li>
                      <strong>Join industry groups:</strong> Network and find job opportunities shared in groups
                    </li>
                  </ol>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Common LinkedIn Mistakes That Hurt Your Job Search</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <ol className="text-red-700 space-y-3 list-decimal pl-5">
                    <li><strong>Inactive profile:</strong> Last activity from 2 years ago signals you're not engaged</li>
                    <li><strong>Incomplete profile:</strong> Missing sections reduce your visibility by 50%</li>
                    <li><strong>Unprofessional photo:</strong> Party pics or no photo = instant red flag</li>
                    <li><strong>Generic headline:</strong> "Student" or "Seeking opportunities" doesn't stand out</li>
                    <li><strong>No personalization in connection requests:</strong> Gets ignored or rejected</li>
                    <li><strong>Posting controversial content:</strong> Politics, religion—keep it professional</li>
                    <li><strong>Spamming people with sales pitches:</strong> Build relationships first</li>
                    <li><strong>Not responding to messages:</strong> Recruiters move on quickly</li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Star className="h-6 w-6" />
                    Your 7-Day LinkedIn Transformation Plan
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Day 1:</strong> Update profile photo, headline, and custom URL</p>
                    <p><strong>Day 2:</strong> Write compelling About section (use the 3-paragraph structure)</p>
                    <p><strong>Day 3:</strong> Rewrite experience descriptions (achievements, not duties)</p>
                    <p><strong>Day 4:</strong> Add 15+ relevant skills, request endorsements</p>
                    <p><strong>Day 5:</strong> Send 20 personalized connection requests</p>
                    <p><strong>Day 6:</strong> Follow 10 companies, join 5 industry groups</p>
                    <p><strong>Day 7:</strong> Post your first piece of content, engage with 10 posts</p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Ready to Find Your Next Opportunity?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Now that your LinkedIn profile is optimized, start searching for opportunities on FutureLinked ZA. 
                    We aggregate fresh job listings from across South Africa, updated daily.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    🔍 Search Jobs Now
                  </Link>
                </div>
              </div>

              {/* Related Articles */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-4">Related Articles</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/articles/cv-writing-guide" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">How to Write a Winning CV</h5>
                    <p className="text-sm text-gray-600">Complement your LinkedIn with a strong CV</p>
                  </Link>
                  <Link href="/articles/interview-guide" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">Master Virtual Interviews</h5>
                    <p className="text-sm text-gray-600">Ace your next job interview</p>
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
