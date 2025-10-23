import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, BookmarkPlus } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CVWritingGuide() {
  return (
    <>
      <Head>
        <title>How to Write a Winning CV for South African Employers | FutureLinked ZA</title>
        <meta name="description" content="Complete guide to creating a professional CV that gets noticed by South African recruiters. Learn formatting, content structure, and common mistakes to avoid." />
        <meta name="keywords" content="CV writing, resume tips, job application, south africa CV, professional CV" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/resources" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>

            {/* Article Header */}
            <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  CV Writing Guide
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  How to Write a Winning CV for South African Employers
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

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Your CV is your first impression with potential employers. In South Africa's competitive job market, 
                  having a well-structured, professional CV can make the difference between getting an interview or being 
                  overlooked. Here's everything you need to know.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Essential CV Components</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Personal Details</h3>
                <p className="text-gray-700 mb-4">
                  Include your full name, phone number, professional email address, and location (city/province). 
                  Avoid including your ID number, full address, or marital status unless specifically requested.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                  <p className="text-green-800 font-medium">✓ Good Example:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    John Doe<br/>
                    +27 82 123 4567<br/>
                    john.doe@email.com<br/>
                    Johannesburg, Gauteng
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Professional Summary</h3>
                <p className="text-gray-700 mb-4">
                  Write a compelling 3-4 sentence summary highlighting your experience, key skills, and career goals. 
                  Tailor this section for each application to match the job requirements.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-blue-800 font-medium">Example:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    "Results-driven marketing professional with 5+ years of experience in digital marketing and brand 
                    management. Proven track record of increasing online engagement by 150% and managing campaigns with 
                    R500k+ budgets. Seeking to leverage expertise in social media strategy and content creation to drive 
                    growth at a forward-thinking organization."
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Work Experience</h3>
                <p className="text-gray-700 mb-4">
                  List your work experience in reverse chronological order (most recent first). For each position include:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                  <li>Job title and company name</li>
                  <li>Employment dates (Month Year format)</li>
                  <li>3-5 bullet points describing achievements (not just duties)</li>
                  <li>Use action verbs and quantify results where possible</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                  <p className="text-yellow-800 font-medium">Pro Tip:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Start bullet points with strong action verbs: Managed, Developed, Increased, Led, Implemented, 
                    Achieved, Delivered, Coordinated, Reduced, Improved
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Education</h3>
                <p className="text-gray-700 mb-4">
                  List your highest qualification first. Include degree/diploma name, institution, graduation year, 
                  and any honors or distinctions. For recent graduates, you can include relevant coursework and projects.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5. Skills</h3>
                <p className="text-gray-700 mb-4">
                  Create a dedicated skills section with both hard skills (technical abilities) and soft skills 
                  (interpersonal qualities). Be honest – you may be tested on these during interviews.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">CV Formatting Best Practices</h2>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Do's:</h4>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Keep it to 2 pages maximum (1 page for entry-level)</li>
                    <li>Use a clean, professional font (Arial, Calibri, or Times New Roman, 11-12pt)</li>
                    <li>Maintain consistent formatting throughout</li>
                    <li>Use bullet points for easy scanning</li>
                    <li>Save as PDF to preserve formatting</li>
                    <li>Name your file professionally: "John_Doe_CV_2025.pdf"</li>
                    <li>Proofread multiple times for typos and grammar errors</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-red-800 mb-3">Don'ts:</h4>
                  <ul className="list-disc pl-6 text-red-700 space-y-2">
                    <li>Don't use fancy fonts, colors, or graphics (unless in creative field)</li>
                    <li>Don't include a photo (unless specifically requested)</li>
                    <li>Don't list references on your CV (say "Available on request")</li>
                    <li>Don't use first person ("I", "me", "my")</li>
                    <li>Don't include salary expectations unless asked</li>
                    <li>Don't lie or exaggerate – it will be discovered</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">ATS-Friendly CV Tips</h2>
                <p className="text-gray-700 mb-4">
                  Many South African companies use Applicant Tracking Systems (ATS) to screen CVs. Make sure yours passes:
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Use keywords</strong> from the job description naturally throughout your CV</li>
                  <li><strong>Avoid tables, text boxes, and columns</strong> – ATS can't read them properly</li>
                  <li><strong>Use standard section headings</strong> like "Work Experience" not "My Journey"</li>
                  <li><strong>Save as .docx or .pdf</strong> – both are ATS-compatible</li>
                  <li><strong>Don't use headers/footers</strong> for important information</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Tailoring Your CV</h2>
                <p className="text-gray-700 mb-4">
                  The biggest mistake job seekers make is sending the same generic CV to every employer. Spend 15-20 
                  minutes customizing your CV for each application:
                </p>
                <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Read the job description carefully and highlight key requirements</li>
                  <li>Adjust your professional summary to match the role</li>
                  <li>Reorder or emphasize relevant experience and skills</li>
                  <li>Use similar language and keywords from the job posting</li>
                  <li>Remove irrelevant experience if it makes your CV too long</li>
                </ol>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold mb-3">Quick Checklist Before Sending</h3>
                  <ul className="space-y-2">
                    <li>☐ Contact details are current and professional</li>
                    <li>☐ No spelling or grammar errors</li>
                    <li>☐ CV is tailored to the specific job</li>
                    <li>☐ Achievements are quantified with numbers/results</li>
                    <li>☐ File is saved as PDF with professional name</li>
                    <li>☐ CV is 1-2 pages maximum</li>
                    <li>☐ References have been contacted and agreed</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Apply?</h3>
                  <p className="text-gray-700 mb-4">
                    Now that you have a winning CV, start searching for opportunities on FutureLinked ZA. 
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

              {/* Share Section */}
              <div className="mt-12 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Found this helpful?</h4>
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <BookmarkPlus className="h-4 w-4" />
                    Save for Later
                  </button>
                </div>
              </div>

              {/* Related Articles */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-4">Related Articles</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/resources" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">Common CV Mistakes to Avoid</h5>
                    <p className="text-sm text-gray-600">Learn what not to do when crafting your CV</p>
                  </Link>
                  <Link href="/resources" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">Top 20 Interview Questions in SA</h5>
                    <p className="text-sm text-gray-600">Prepare for your next job interview</p>
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
