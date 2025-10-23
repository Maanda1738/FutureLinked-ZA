import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function InterviewGuide() {
  return (
    <>
      <Head>
        <title>Mastering Virtual Interviews in 2025 | FutureLinked ZA</title>
        <meta name="description" content="Complete guide to virtual interviews. Learn setup tips, body language, common questions, and how to make a great impression remotely." />
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
                <span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
                  Interview Preparation
                </span>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Mastering Virtual Interviews in 2025
                </h1>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>4 min read</span>
                  </div>
                  <span>•</span>
                  <span>Updated October 2025</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Virtual interviews have become the standard in South Africa's job market. Whether you're interviewing 
                  for a remote position or an in-office role, mastering video interviews is essential. Here's your 
                  complete guide to acing your next virtual interview.
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Technical Setup</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Equipment Checklist</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li><strong>Stable Internet:</strong> Test your connection 24 hours before (use speedtest.net)</li>
                  <li><strong>Camera:</strong> Built-in laptop camera is fine - position at eye level</li>
                  <li><strong>Microphone:</strong> Earphones with built-in mic work better than laptop audio</li>
                  <li><strong>Backup Device:</strong> Have your phone ready with mobile data as backup</li>
                  <li><strong>Backup Plan:</strong> Have interviewer's phone number in case of tech failure</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-blue-800 font-medium">Pro Tip:</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Close all unnecessary programs and browser tabs. Disable notifications. Update your software 
                    before the interview - not during!
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Lighting & Background</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                  <li>Face a window or light source - avoid backlighting</li>
                  <li>Use a plain, tidy background or virtual background</li>
                  <li>Ensure your face is well-lit and clearly visible</li>
                  <li>Test your setup on a video call with a friend</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Top 20 Interview Questions in South Africa</h2>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Questions:</h3>
                  <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                    <li>"Tell me about yourself"</li>
                    <li>"Why do you want to work here?"</li>
                    <li>"What are your strengths and weaknesses?"</li>
                    <li>"Where do you see yourself in 5 years?"</li>
                    <li>"Why should we hire you?"</li>
                    <li>"Describe a challenge you overcame"</li>
                    <li>"What is your salary expectation?"</li>
                    <li>"Why did you leave your last job?"</li>
                    <li>"How do you handle pressure/stress?"</li>
                    <li>"What's your leadership style?"</li>
                  </ol>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">STAR Method for Behavioral Questions</h3>
                <p className="text-gray-700 mb-4">
                  Use this framework to answer "Tell me about a time when..." questions:
                </p>
                <ul className="list-none mb-6 text-gray-700 space-y-3">
                  <li><strong>S - Situation:</strong> Set the context (what was happening?)</li>
                  <li><strong>T - Task:</strong> Explain your responsibility (what needed to be done?)</li>
                  <li><strong>A - Action:</strong> Describe what YOU did (be specific)</li>
                  <li><strong>R - Result:</strong> Share the outcome (quantify if possible)</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Body Language & Presentation</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">✓ Do:</h4>
                    <ul className="text-gray-700 space-y-2 text-sm">
                      <li>• Maintain eye contact (look at camera, not screen)</li>
                      <li>• Smile and show enthusiasm</li>
                      <li>• Sit up straight with good posture</li>
                      <li>• Use hand gestures naturally</li>
                      <li>• Dress professionally (top and bottom!)</li>
                      <li>• Keep a glass of water nearby</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3">✗ Don't:</h4>
                    <ul className="text-red-700 space-y-2 text-sm">
                      <li>• Look at yourself on screen constantly</li>
                      <li>• Fidget or touch your face</li>
                      <li>• Read from notes obviously</li>
                      <li>• Have distracting items in frame</li>
                      <li>• Eat or drink (except water)</li>
                      <li>• Let others interrupt you</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Questions to Ask the Interviewer</h2>
                <p className="text-gray-700 mb-4">
                  Always prepare 3-5 intelligent questions. Never say "No, I don't have any questions."
                </p>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
                  <p className="text-purple-800 font-medium mb-2">Great Questions to Ask:</p>
                  <ul className="text-gray-700 space-y-2 text-sm">
                    <li>• "What does success look like in this role after 6 months?"</li>
                    <li>• "Can you describe the team I'd be working with?"</li>
                    <li>• "What are the biggest challenges facing the department?"</li>
                    <li>• "How does the company support professional development?"</li>
                    <li>• "What's the next step in the interview process?"</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Common Technical Issues & Solutions</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-semibold text-gray-800">Problem: Poor internet connection</p>
                    <p className="text-gray-600 text-sm">Solution: Switch to mobile data, move closer to router, or ask to reschedule</p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-semibold text-gray-800">Problem: Audio echo or feedback</p>
                    <p className="text-gray-600 text-sm">Solution: Use earphones, mute when not speaking, ask others to mute</p>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="font-semibold text-gray-800">Problem: Can't join the meeting</p>
                    <p className="text-gray-600 text-sm">Solution: Test link 30 min early, have backup meeting ID/phone number ready</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold mb-3">Final Checklist - 30 Minutes Before</h3>
                  <ul className="space-y-2">
                    <li>☐ Test camera, mic, and internet</li>
                    <li>☐ Close unnecessary apps and tabs</li>
                    <li>☐ Have CV and notes ready</li>
                    <li>☐ Glass of water within reach</li>
                    <li>☐ Phone on silent (but nearby as backup)</li>
                    <li>☐ Notify household members not to disturb</li>
                    <li>☐ Deep breath - you've got this! 💪</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Ready to Apply?</h3>
                  <p className="text-gray-700 mb-4">
                    Now that you're prepared to ace your virtual interview, start applying for opportunities 
                    on FutureLinked ZA.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    🔍 Search Jobs Now
                  </Link>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold text-gray-800 mb-4">Related Articles</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link href="/articles/cv-writing-guide" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">How to Write a Winning CV</h5>
                    <p className="text-sm text-gray-600">Master the art of CV writing for SA employers</p>
                  </Link>
                  <Link href="/resources" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-blue-50 transition-colors">
                    <h5 className="font-semibold text-gray-800 mb-2">Salary Negotiation Guide</h5>
                    <p className="text-sm text-gray-600">Learn how to negotiate your job offer</p>
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
