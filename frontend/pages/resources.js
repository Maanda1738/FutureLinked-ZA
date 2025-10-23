import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, FileText, Users, TrendingUp, Award, Briefcase } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Resources() {
  return (
    <>
      <Head>
        <title>Career Resources & Tips | FutureLinked ZA</title>
        <meta name="description" content="Free career resources, CV templates, interview tips, and job search strategies for South African job seekers" />
        <meta name="keywords" content="career tips, CV writing, interview preparation, job search tips, career advice south africa" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Career Resources & Tips
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to land your dream job in South Africa - from CV writing to interview preparation
              </p>
            </div>

            {/* Resource Categories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <ResourceCard
                icon={<FileText className="h-8 w-8" />}
                title="CV Writing Guide"
                description="Learn how to create a professional CV that gets noticed by South African employers"
                color="blue"
                articles={[
                  "How to write a winning CV in 2025",
                  "Common CV mistakes to avoid",
                  "CV formatting tips for ATS systems",
                  "How to write a career objective"
                ]}
              />

              <ResourceCard
                icon={<Users className="h-8 w-8" />}
                title="Interview Preparation"
                description="Master the art of interviews with proven strategies and common questions"
                color="green"
                articles={[
                  "Top 20 interview questions in SA",
                  "How to answer 'Tell me about yourself'",
                  "STAR method for behavioral questions",
                  "Virtual interview best practices"
                ]}
              />

              <ResourceCard
                icon={<TrendingUp className="h-8 w-8" />}
                title="Salary Negotiation"
                description="Learn how to negotiate your salary and benefits confidently"
                color="purple"
                articles={[
                  "Average salaries in South Africa 2025",
                  "How to negotiate your first job offer",
                  "When to discuss salary expectations",
                  "Benefits beyond salary to consider"
                ]}
              />

              <ResourceCard
                icon={<Award className="h-8 w-8" />}
                title="Bursaries & Scholarships"
                description="Complete guide to finding and applying for bursaries in South Africa"
                color="orange"
                articles={[
                  "Top SA companies offering bursaries",
                  "How to write a bursary motivation letter",
                  "Bursary application deadlines 2025",
                  "NSFAS vs private bursaries explained"
                ]}
              />

              <ResourceCard
                icon={<Briefcase className="h-8 w-8" />}
                title="Graduate Programs"
                description="Everything about graduate programs, learnerships, and internships"
                color="red"
                articles={[
                  "Best graduate programs in SA 2025",
                  "Internship vs Learnership: What's the difference?",
                  "How to stand out in graduate applications",
                  "Graduate program application timeline"
                ]}
              />

              <ResourceCard
                icon={<BookOpen className="h-8 w-8" />}
                title="Career Development"
                description="Skills development, career planning, and professional growth tips"
                color="indigo"
                articles={[
                  "Most in-demand skills in SA 2025",
                  "How to switch careers successfully",
                  "Building a professional network",
                  "Free online courses for career growth"
                ]}
              />
            </div>

            {/* Featured Articles */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Career Tips</h2>
              
              <div className="space-y-6">
                <Link href="/articles/cv-writing-guide">
                  <Article
                    title="How to Write a Winning CV for South African Employers"
                    excerpt="Your CV is your first impression. Learn the essential components that make South African recruiters take notice, from proper formatting to highlighting your achievements effectively."
                    readTime="5 min read"
                  />
                </Link>

                <Article
                  title="Mastering Virtual Interviews in 2025"
                  excerpt="With remote work becoming standard, virtual interviews are here to stay. Discover professional setup tips, body language tricks, and how to handle technical difficulties gracefully."
                  readTime="4 min read"
                />

                <Article
                  title="Top 10 Companies Hiring Graduates in South Africa"
                  excerpt="Explore the leading companies actively recruiting graduates in 2025, including their graduate programs, application processes, and what they look for in candidates."
                  readTime="6 min read"
                />

                <Article
                  title="Bursary Application Success: A Complete Guide"
                  excerpt="Applying for bursaries can be competitive. This comprehensive guide covers how to find opportunities, write compelling motivation letters, and maximize your chances of success."
                  readTime="8 min read"
                />

                <Article
                  title="Negotiating Your First Salary: A South African Guide"
                  excerpt="Don't leave money on the table! Learn when and how to negotiate your first job offer, including market research tips and scripts for salary discussions."
                  readTime="5 min read"
                />
              </div>
            </div>

            {/* Job Search Tips Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-12">
              <h2 className="text-3xl font-bold mb-6">Job Search Best Practices</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">✅ Do:</h3>
                  <ul className="space-y-2">
                    <li>• Tailor your CV for each application</li>
                    <li>• Research the company before applying</li>
                    <li>• Follow up after submitting applications</li>
                    <li>• Network on LinkedIn and professional groups</li>
                    <li>• Apply within 48 hours of job posting</li>
                    <li>• Use keywords from the job description</li>
                    <li>• Keep your LinkedIn profile updated</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">❌ Don't:</h3>
                  <ul className="space-y-2">
                    <li>• Use the same generic CV for all jobs</li>
                    <li>• Apply without reading the full job description</li>
                    <li>• Include unprofessional email addresses</li>
                    <li>• Lie about qualifications or experience</li>
                    <li>• Apply for jobs you're not qualified for</li>
                    <li>• Ignore typos and grammatical errors</li>
                    <li>• Forget to include contact information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Free Templates Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Free Downloadable Templates</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <TemplateCard
                  title="Professional CV Template"
                  description="Clean, ATS-friendly CV template"
                  format="DOCX"
                />
                <TemplateCard
                  title="Cover Letter Template"
                  description="Customizable cover letter format"
                  format="DOCX"
                />
                <TemplateCard
                  title="Bursary Motivation Letter"
                  description="Winning motivation letter template"
                  format="PDF"
                />
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Find Your Dream Job?
              </h3>
              <p className="text-gray-600 mb-6">
                Start searching for opportunities across South Africa - fresh listings updated daily
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
              >
                🔍 Search Jobs Now
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

function ResourceCard({ icon, title, description, color, articles }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    indigo: 'from-indigo-500 to-indigo-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-t-4 border-transparent hover:border-primary-500">
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm">{description}</p>
      <ul className="space-y-2">
        {articles.map((article, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>{article}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Article({ title, excerpt, readTime }) {
  return (
    <div className="border-l-4 border-primary-500 pl-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{readTime}</span>
      </div>
      <p className="text-gray-600">{excerpt}</p>
      <span className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-2 inline-block">
        Read More →
      </span>
    </div>
  );
}

function TemplateCard({ title, description, format }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 hover:bg-blue-50 transition-all text-center">
      <div className="text-3xl mb-2">📄</div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
        {format}
      </span>
    </div>
  );
}
