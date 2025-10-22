import { useState, useEffect } from 'react';
import { logAdClick } from '../utils/analytics';

export default function EnhancedAdBanner({ type = 'banner', className = '', adText = 'Advertisement', placement = 'content' }) {
  const [adContent, setAdContent] = useState(null);
  const [adType, setAdType] = useState('demo');

  useEffect(() => {
    loadAd();
  }, []);

  const loadAd = async () => {
    // Check for Google AdSense first
    if (process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && typeof window !== 'undefined') {
      try {
        // Initialize AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdType('adsense');
        return;
      } catch (error) {
        console.warn('AdSense failed to load:', error);
      }
    }

    // Fallback to demo/affiliate ads
    const ads = await loadDemoAds();
    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    setAdContent(randomAd);
    setAdType('affiliate');
  };

  const loadDemoAds = async () => {
    return [
      {
        title: "Udemy - Learn In-Demand Skills",
        description: "Master Data Science, Web Development, AI & more. 85% off courses!",
        cta: "Start Learning",
        url: "https://www.udemy.com",
        image: "https://via.placeholder.com/300x200/1c4482/ffffff?text=Udemy+Courses",
        category: "education"
      },
      {
        title: "LinkedIn Learning - Professional Development",
        description: "Advance your career with expert-led courses. Free trial available.",
        cta: "Try Free",
        url: "https://www.linkedin.com/learning",
        image: "https://via.placeholder.com/300x200/0077b5/ffffff?text=LinkedIn+Learning",
        category: "education"
      },
      {
        title: "CV Writing Services South Africa",
        description: "Professional CV writing that gets you noticed. Money-back guarantee.",
        cta: "Get CV",
        url: "#cv-services",
        image: "https://via.placeholder.com/300x200/28a745/ffffff?text=CV+Services",
        category: "career_services"
      },
      {
        title: "Interview Coaching by Experts",
        description: "1-on-1 coaching to ace your next interview. Book your session today.",
        cta: "Book Now",
        url: "#interview-coaching",
        image: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Interview+Prep",
        category: "career_services"
      },
      {
        title: "Coursera - University Courses Online",
        description: "Learn from top universities. Financial aid available for SA students.",
        cta: "Explore",
        url: "https://www.coursera.org",
        image: "https://via.placeholder.com/300x200/0056d3/ffffff?text=Coursera",
        category: "education"
      },
      {
        title: "GetSmarter - UCT Online Courses",
        description: "Premium online courses from University of Cape Town. Globally recognized.",
        cta: "Learn More",
        url: "https://www.getsmarter.com",
        image: "https://via.placeholder.com/300x200/f39c12/ffffff?text=GetSmarter",
        category: "education"
      }
    ];
  };

  const handleAdClick = (adTitle, adCategory) => {
    logAdClick(adCategory || 'unknown', placement);
    
    // Track specific ad performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ad_interaction', {
        'ad_title': adTitle,
        'ad_placement': placement,
        'ad_type': adType
      });
    }
  };

  if (type === 'google-adsense' && process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    return (
      <div className={`ad-banner ${className}`}>
        <div className="text-xs text-gray-500 mb-2 text-center">{adText}</div>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot="1234567890"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`ad-banner ${className}`}>
        <div className="text-xs text-gray-500 mb-2 text-center">{adText}</div>
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="aspect-video flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">🎥</div>
              <p className="text-sm">Video Ad Placeholder</p>
              <p className="text-xs opacity-75">YouTube/Video ads would appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className={`ad-banner p-4 text-center ${className}`}>
        <div className="text-xs text-gray-500 mb-2">{adText}</div>
        
        {adContent ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={adContent.image} 
                alt={adContent.title}
                className="w-full md:w-48 h-32 object-cover rounded"
              />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">{adContent.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{adContent.description}</p>
                <a 
                  href={adContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleAdClick(adContent.title, adContent.category)}
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  {adContent.cta}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-pulse">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg border">
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}