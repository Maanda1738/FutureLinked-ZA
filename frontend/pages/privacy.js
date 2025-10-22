import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - FutureLinked ZA</title>
        <meta name="description" content="Privacy Policy for FutureLinked ZA - Learn how we protect your data." />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-600 mb-8">Last Updated: October 22, 2025</p>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">1. Introduction</h2>
                <p className="leading-relaxed">
                  Welcome to FutureLinked ZA ("we," "our," or "us"). We are committed to protecting your privacy and ensuring 
                  the security of any information you provide while using our website (https://futurelinked-za.co.za). 
                  This Privacy Policy explains how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">2. Information We Collect</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Information You Provide</h3>
                <p className="leading-relaxed mb-3">
                  FutureLinked ZA does NOT require user registration or account creation. We do not collect personal 
                  information such as names, email addresses, or phone numbers unless you voluntarily provide them 
                  through our contact form.
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
                <p className="leading-relaxed mb-3">
                  We may automatically collect certain technical information when you visit our website, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Search queries (to improve our service)</li>
                  <li>Referral source (how you found our website)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">3. How We Use Your Information</h2>
                <p className="leading-relaxed mb-3">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our job search services</li>
                  <li>Analyze website usage and optimize user experience</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">4. Third-Party Services</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">4.1 Job Listings</h3>
                <p className="leading-relaxed mb-3">
                  We aggregate job listings from third-party sources including Adzuna API. When you click "Apply Now" 
                  on a job listing, you will be redirected to the employer's website or the job board where the listing 
                  originated. We are not responsible for the privacy practices of these external websites.
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.2 Analytics</h3>
                <p className="leading-relaxed mb-3">
                  We may use Google Analytics or similar services to understand how visitors use our website. These 
                  services may use cookies and similar technologies. You can opt out of Google Analytics by installing 
                  the Google Analytics Opt-out Browser Add-on.
                </p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.3 Advertising</h3>
                <p className="leading-relaxed mb-3">
                  We may display advertisements through Google AdSense or similar advertising networks. These networks 
                  may use cookies to serve ads based on your prior visits to our website or other websites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">5. Cookies</h2>
                <p className="leading-relaxed mb-3">
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience. 
                  Cookies are small text files stored on your device. You can control cookies through your browser 
                  settings, but disabling cookies may affect website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">6. Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 
                  completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">7. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain automatically collected information only for as long as necessary to provide our services 
                  and comply with legal obligations. Search queries and analytics data may be retained in aggregate, 
                  anonymized form for service improvement purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">8. Your Rights</h2>
                <p className="leading-relaxed mb-3">Under South African data protection laws (POPIA), you have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Withdraw consent (where applicable)</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">9. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our website is intended for users aged 16 and above. We do not knowingly collect information from 
                  children under 16. If you believe we have collected information from a child under 16, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">10. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by 
                  posting the new policy on this page with an updated "Last Updated" date. We encourage you to review 
                  this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-primary-600 mb-3">11. Contact Us</h2>
                <p className="leading-relaxed mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
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
                  This Privacy Policy is governed by the laws of South Africa, including the Protection of Personal 
                  Information Act (POPIA).
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
