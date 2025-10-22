import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - FutureLinked ZA</title>
        <meta name="description" content="Terms of Service for FutureLinked ZA - Read our terms and conditions." />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-600 mb-8">Last Updated: October 22, 2025</p>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  Welcome to FutureLinked ZA. By accessing and using our website (https://futurelinked-za.co.za), 
                  you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">2. Description of Service</h2>
                <p className="leading-relaxed mb-3">
                  FutureLinked ZA is a job search aggregation platform that provides users with access to employment 
                  and educational opportunities across South Africa, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Job listings</li>
                  <li>Internship opportunities</li>
                  <li>Graduate programs</li>
                  <li>Bursaries and scholarships</li>
                  <li>Learnership programs</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  We aggregate job listings from third-party sources and APIs. We do not directly employ or hire candidates.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">3. Use of Service</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">3.1 Eligibility</h3>
                <p className="leading-relaxed mb-3">
                  You must be at least 16 years old to use our service. By using FutureLinked ZA, you represent that 
                  you meet this age requirement.
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">3.2 Permitted Use</h3>
                <p className="leading-relaxed mb-3">You agree to use our service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use automated systems (bots, scrapers) to access or collect data from our website</li>
                  <li>Attempt to interfere with or disrupt our service or servers</li>
                  <li>Use our service to transmit spam, viruses, or malicious code</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Reproduce, duplicate, or copy any part of our service without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">4. Third-Party Content and Links</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">4.1 Job Listings</h3>
                <p className="leading-relaxed mb-3">
                  All job listings displayed on FutureLinked ZA are sourced from third-party providers including Adzuna API 
                  and other job boards. We do not verify, endorse, or guarantee the accuracy, completeness, or legitimacy 
                  of any job listing.
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.2 External Websites</h3>
                <p className="leading-relaxed mb-3">
                  When you click "Apply Now" on a job listing, you will be redirected to the employer's website or the 
                  original job board. We are not responsible for the content, privacy practices, or terms of service of 
                  these external websites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">5. Disclaimer of Warranties</h2>
                <p className="leading-relaxed mb-3">
                  FutureLinked ZA is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, either 
                  express or implied, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The accuracy, reliability, or completeness of job listings</li>
                  <li>The availability or uninterrupted access to our service</li>
                  <li>The fitness for a particular purpose</li>
                  <li>That our service will be error-free or secure</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  We do not guarantee that any job listing is legitimate, current, or that you will be hired or awarded 
                  a bursary/scholarship by applying through our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">6. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  To the fullest extent permitted by law, FutureLinked ZA, its owners, employees, and affiliates shall 
                  not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of 
                  or related to your use of our service, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                  <li>Loss of employment opportunities</li>
                  <li>Fraudulent job listings or scams</li>
                  <li>Data loss or security breaches</li>
                  <li>Errors or omissions in job listings</li>
                  <li>Any interactions with employers or third parties</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">7. User Responsibilities</h2>
                <p className="leading-relaxed mb-3">As a user of FutureLinked ZA, you are solely responsible for:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verifying the legitimacy of job listings before applying</li>
                  <li>Protecting your personal information when applying for jobs</li>
                  <li>Complying with the terms and conditions of external job boards and employer websites</li>
                  <li>Ensuring your applications meet the requirements of each opportunity</li>
                  <li>Never paying fees to apply for jobs through our platform (legitimate jobs are free to apply for)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">8. Intellectual Property</h2>
                <p className="leading-relaxed mb-3">
                  All content on FutureLinked ZA, including but not limited to text, graphics, logos, images, and software, 
                  is the property of FutureLinked ZA or its content suppliers and is protected by South African and 
                  international copyright laws.
                </p>
                <p className="leading-relaxed">
                  Job listings are the property of their respective copyright holders. We display them under license or 
                  fair use for the purpose of job search aggregation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">9. Reporting Issues</h2>
                <p className="leading-relaxed">
                  If you encounter fraudulent job listings, technical issues, or copyright concerns, please contact us 
                  immediately at contact@futurelinked-za.co.za. We take such matters seriously and will investigate promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">10. Modifications to Service and Terms</h2>
                <p className="leading-relaxed mb-3">
                  We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or discontinue our service at any time without notice</li>
                  <li>Update these Terms of Service at our discretion</li>
                  <li>Remove or modify job listings as needed</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  Continued use of our service after changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">11. Termination</h2>
                <p className="leading-relaxed">
                  We reserve the right to terminate or suspend access to our service immediately, without prior notice, 
                  for any reason, including but not limited to violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">12. Governing Law</h2>
                <p className="leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of South Africa. 
                  Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction 
                  of the South African courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">13. Contact Information</h2>
                <p className="leading-relaxed mb-3">
                  For questions, concerns, or feedback regarding these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">FutureLinked ZA</p>
                  <p>Email: contact@futurelinked-za.co.za</p>
                  <p>Website: https://futurelinked-za.co.za</p>
                  <p>Location: South Africa</p>
                </div>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  By using FutureLinked ZA, you acknowledge that you have read, understood, and agree to be bound by 
                  these Terms of Service and our Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
