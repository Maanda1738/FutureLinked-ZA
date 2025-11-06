import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">FutureLinked ZA</h3>
            <p className="text-gray-300 mb-4">
              South Africa's intelligent digital gateway for accessing employment and educational opportunities. 
              Connecting you directly to verified jobs, internships, and bursaries.
            </p>
            <p className="text-sm text-gray-400">
              Made with <Heart className="h-4 w-4 inline text-red-500" /> for South African job seekers
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-semibold mb-4">Popular Searches</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/?search=internship" className="hover:text-white transition-colors">Internships</a></li>
              <li><a href="/?search=graduate" className="hover:text-white transition-colors">Graduate Programs</a></li>
              <li><a href="/?search=bursary" className="hover:text-white transition-colors">Bursaries</a></li>
              <li><a href="/?search=IT+jobs" className="hover:text-white transition-colors">IT Jobs</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm mb-1">
                © {currentYear} FutureLinked ZA. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Created & Developed by <span className="text-blue-400 font-semibold">Maanda Netshisumbewa</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="text-sm text-gray-400">Powered by Adzuna, Jooble & Google APIs</span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Intelligent Multi-Source Search</span>
                <span>•</span>
                <span>🇿🇦 Proudly South African</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}