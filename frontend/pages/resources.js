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

                <Link href="/articles/interview-guide">
                  <Article
                    title="Mastering Virtual Interviews in 2025"
                    excerpt="With remote work becoming standard, virtual interviews are here to stay. Discover professional setup tips, body language tricks, and how to handle technical difficulties gracefully."
                    readTime="4 min read"
                  />
                </Link>

                <Link href="/resources">
                  <Article
                    title="Top 10 Companies Hiring Graduates in South Africa"
                    excerpt="Explore the leading companies actively recruiting graduates in 2025, including their graduate programs, application processes, and what they look for in candidates."
                    readTime="6 min read"
                  />
                </Link>

                <Link href="/resources">
                  <Article
                    title="Bursary Application Success: A Complete Guide"
                    excerpt="Applying for bursaries can be competitive. This comprehensive guide covers how to find opportunities, write compelling motivation letters, and maximize your chances of success."
                    readTime="8 min read"
                  />
                </Link>

                <Link href="/articles/salary-negotiation">
                  <Article
                    title="Negotiating Your First Salary: A South African Guide"
                    excerpt="Don't leave money on the table! Learn when and how to negotiate your first job offer, including market research tips and scripts for salary discussions."
                    readTime="5 min read"
                  />
                </Link>
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
  const handleDownload = () => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    // Generate different template content based on type
    if (title.includes('CV')) {
      filename = 'Professional_CV_Template.txt';
      content = `PROFESSIONAL CV TEMPLATE
========================================

PERSONAL INFORMATION
--------------------
Full Name: [Your Full Name]
Phone: [Your Phone Number]
Email: [Your Professional Email]
Location: [City, Province]
LinkedIn: [Your LinkedIn Profile URL]


PROFESSIONAL SUMMARY
--------------------
[Write 3-4 sentences highlighting your experience, key skills, and career goals. 
Tailor this section for each job application.]

Example:
Results-driven marketing professional with 5+ years of experience in digital marketing 
and brand management. Proven track record of increasing online engagement by 150% and 
managing campaigns with R500k+ budgets. Seeking to leverage expertise in social media 
strategy and content creation to drive growth at a forward-thinking organization.


WORK EXPERIENCE
---------------

[Job Title] | [Company Name]
[Month Year] - [Month Year] or Present
• [Achievement-focused bullet point with quantified results]
• [Action verb + specific task + measurable outcome]
• [Another achievement demonstrating your impact]
• [Additional responsibility or accomplishment]

[Previous Job Title] | [Previous Company]
[Month Year] - [Month Year]
• [Achievement with metrics]
• [Specific contribution to company goals]
• [Project or initiative you led]


EDUCATION
---------

[Degree/Diploma Name] | [Institution Name]
Graduated: [Month Year]
Achievements: [Any honors, distinctions, or relevant coursework]

[Previous Qualification] | [Institution]
Graduated: [Year]


SKILLS
------

Technical Skills:
• [Skill 1], [Skill 2], [Skill 3]
• [Software/Tools you're proficient in]
• [Industry-specific technical abilities]

Soft Skills:
• [Communication], [Leadership], [Problem-solving]
• [Teamwork], [Time Management], [Adaptability]


CERTIFICATIONS (Optional)
------------------------
• [Certification Name] - [Issuing Organization] ([Year])
• [Another Certification] - [Organization] ([Year])


LANGUAGES (Optional)
-------------------
• English - Fluent
• [Other Language] - [Proficiency Level]


REFERENCES
----------
Available upon request


TIPS FOR USING THIS TEMPLATE:
------------------------------
✓ Keep your CV to 2 pages maximum (1 page for entry-level)
✓ Use action verbs: Managed, Developed, Increased, Led, Implemented
✓ Quantify achievements with numbers, percentages, or results
✓ Tailor your CV for each job application
✓ Proofread multiple times - NO typos!
✓ Save as PDF before sending: [YourName]_CV_2025.pdf
✓ Use a professional email address
✓ Update regularly as you gain new experience

Download from FutureLinked ZA - https://futurelinked-za.co.za
`;
    } else if (title.includes('Cover Letter')) {
      filename = 'Cover_Letter_Template.txt';
      content = `COVER LETTER TEMPLATE
========================================

[Your Full Name]
[Your Phone Number]
[Your Email Address]
[Your City, Province]
[Date: October 23, 2025]

[Hiring Manager's Name]
[Job Title]
[Company Name]
[Company Address]

Dear [Hiring Manager's Name / Hiring Manager],

OPENING PARAGRAPH:
I am writing to express my strong interest in the [Job Title] position at [Company Name], 
as advertised on [where you found the job - e.g., FutureLinked ZA]. With [X years] of 
experience in [your field/industry] and a proven track record of [key achievement], 
I am confident I would be a valuable addition to your team.

BODY PARAGRAPH 1 - Your Qualifications:
In my current/previous role as [Your Current/Last Job Title] at [Company], I [describe 
your main responsibility and achievement]. Specifically, I [quantified achievement - e.g., 
"increased sales by 30%", "managed a team of 10", "reduced costs by R50,000"]. This 
experience has equipped me with [relevant skills] that directly align with the requirements 
outlined in your job description.

BODY PARAGRAPH 2 - Why This Company:
I am particularly drawn to [Company Name] because [specific reason - mention company values, 
projects, reputation, or culture]. I am impressed by [something specific about the company - 
recent achievement, product, or initiative], and I am excited about the opportunity to 
contribute to [specific goal or project mentioned in job description].

BODY PARAGRAPH 3 - Additional Value (Optional):
Beyond my professional experience, I bring [additional skills, certifications, or qualities]. 
My ability to [specific skill] combined with my passion for [industry/field] makes me 
well-suited to help [Company Name] achieve [specific goal].

CLOSING PARAGRAPH:
I would welcome the opportunity to discuss how my skills and experiences align with your 
needs. I am available for an interview at your convenience and can be reached at [phone] 
or [email]. Thank you for considering my application. I look forward to the possibility 
of contributing to [Company Name]'s continued success.

Sincerely,
[Your Full Name]


TIPS FOR CUSTOMIZING YOUR COVER LETTER:
---------------------------------------
✓ Always address the hiring manager by name if possible (research on LinkedIn)
✓ Mention the specific job title and where you found the posting
✓ Keep it to one page (3-4 paragraphs maximum)
✓ Show enthusiasm for the role and company
✓ Use specific examples and quantify achievements
✓ Proofread carefully - typos are deal-breakers!
✓ Match the tone to the company culture (formal vs. casual)
✓ Save as PDF: [YourName]_CoverLetter_[CompanyName].pdf

Download from FutureLinked ZA - https://futurelinked-za.co.za
`;
    } else if (title.includes('Motivation Letter')) {
      filename = 'Bursary_Motivation_Letter_Template.txt';
      content = `BURSARY MOTIVATION LETTER TEMPLATE
========================================

[Your Full Name]
[Your Physical Address]
[Your Phone Number]
[Your Email Address]
[Date: October 23, 2025]

[Bursary Committee / Company Name]
[Address]

RE: APPLICATION FOR [BURSARY NAME] - [ACADEMIC YEAR]

Dear Sir/Madam / [Specific Name if known],

OPENING PARAGRAPH - Introduction:
I am writing to apply for the [Bursary Name] offered by [Company/Organization]. I am 
currently a [year of study] student at [University/College Name], pursuing a [Degree Name] 
in [Field of Study]. I am passionate about [field/industry] and believe this bursary will 
enable me to achieve my academic and career goals.

PARAGRAPH 2 - Academic Performance:
Throughout my academic journey, I have maintained a strong academic record, achieving 
[mention your average, e.g., "an average of 75%"] in my [matric/first year/etc.]. My 
dedication to my studies is demonstrated through [specific achievements - Dean's List, 
top student in a subject, awards, etc.]. I am particularly interested in [specific area 
of your field] and have excelled in modules such as [relevant subjects].

PARAGRAPH 3 - Financial Need:
I am applying for this bursary due to financial constraints that make it challenging to 
fund my tertiary education. [Briefly explain your circumstances - single parent household, 
unemployed parent, family responsibilities, etc.]. Despite these challenges, I remain 
committed to my studies and am determined to succeed academically. This bursary would 
significantly alleviate the financial burden and allow me to focus fully on my education.

PARAGRAPH 4 - Career Goals & Alignment:
Upon completing my degree, I aspire to [describe your career goals]. I am particularly 
interested in working in [specific industry/sector], where I can [how you want to make 
an impact]. I am drawn to [Company Name] because of [specific reason - company values, 
industry leadership, innovation, etc.], and I would be honored to contribute to your 
organization as a future employee.

PARAGRAPH 5 - Personal Qualities & Extracurricular:
Beyond academics, I have demonstrated leadership and commitment through [mention 
extracurricular activities, volunteer work, part-time jobs, sports, community service]. 
These experiences have taught me [skills like teamwork, time management, perseverance], 
which I believe are essential for success both in university and in the workplace.

CLOSING PARAGRAPH:
I am confident that with the support of the [Bursary Name], I will not only complete my 
studies successfully but also become a valuable asset to [Company/Organization Name]. 
I am committed to maintaining high academic standards and fulfilling any obligations 
associated with this bursary. Thank you for considering my application. I look forward 
to the opportunity to contribute to your organization in the future.

Yours sincerely,
[Your Full Name]
[Student Number - if applicable]


TIPS FOR WRITING A WINNING BURSARY MOTIVATION LETTER:
----------------------------------------------------
✓ Research the company/organization offering the bursary
✓ Be honest about your financial situation (don't exaggerate)
✓ Highlight academic achievements with specific examples
✓ Show genuine interest in the field and company
✓ Keep it professional but let your personality shine through
✓ Proofread multiple times - grammar matters!
✓ Keep it to 1-2 pages maximum
✓ Include any supporting documents: academic transcript, ID copy, proof of income
✓ Submit before the deadline!
✓ Follow up after 2 weeks if you haven't heard back

Download from FutureLinked ZA - https://futurelinked-za.co.za
`;
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    // Show success message
    alert(`✅ ${filename} downloaded successfully!\n\nOpen the file to see your template.`);
  };

  return (
    <button 
      onClick={handleDownload}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary-500 hover:bg-blue-50 transition-all text-center w-full cursor-pointer"
    >
      <div className="text-3xl mb-2">📄</div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <span className="inline-block px-3 py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700">
        Download {format}
      </span>
    </button>
  );
}
