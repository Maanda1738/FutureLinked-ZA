import { useState, useEffect } from 'react';

export default function AdBanner({ type = 'banner', className = '', adText = 'Advertisement' }) {
  const [adContent, setAdContent] = useState(null);

  useEffect(() => {
    // Simulate ad loading
    const loadAd = () => {
      const sampleAds = [
        {
          title: "Boost Your Career with Online Courses",
          description: "Get certified in Data Science, AI, and more. Start learning today!",
          cta: "Start Learning",
          url: "#",
          image: "https://via.placeholder.com/300x200/3b82f6/ffffff?text=Online+Courses"
        },
        {
          title: "Professional CV Writing Service",
          description: "Stand out from the crowd with a professionally written CV.",
          cta: "Get Started",
          url: "#",
          image: "https://via.placeholder.com/300x200/10b981/ffffff?text=CV+Services"
        },
        {
          title: "Interview Preparation Coaching",
          description: "Ace your next interview with expert coaching and practice sessions.",
          cta: "Book Session",
          url: "#",
          image: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Interview+Prep"
        }
      ];

      const randomAd = sampleAds[Math.floor(Math.random() * sampleAds.length)];
      setAdContent(randomAd);
    };

    const timer = setTimeout(loadAd, 500); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  if (type === 'banner') {
    return (
      <div className={`ad-banner p-4 text-center ${className}`}>
        <div className="text-xs text-gray-500 mb-2">{adText}</div>
        
        {adContent ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg border">
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
                  className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
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

  if (type === 'sidebar') {
    return (
      <div className={`ad-banner p-4 ${className}`}>
        <div className="text-xs text-gray-500 mb-2 text-center">{adText}</div>
        
        {adContent ? (
          <div className="bg-white rounded-lg border p-4 text-center">
            <img 
              src={adContent.image} 
              alt={adContent.title}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <h4 className="font-medium text-gray-800 mb-2 text-sm">{adContent.title}</h4>
            <p className="text-gray-600 text-xs mb-3">{adContent.description}</p>
            <a 
              href={adContent.url}
              className="block w-full px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-xs"
            >
              {adContent.cta}
            </a>
          </div>
        ) : (
          <div className="animate-pulse bg-white rounded-lg border p-4">
            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        )}
      </div>
    );
  }

  // Google AdSense placeholder (when configured)
  if (type === 'google-adsense') {
    return (
      <div className={`ad-banner ${className}`}>
        <div className="text-xs text-gray-500 mb-2 text-center">{adText}</div>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ? (
          <ins 
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
            data-ad-slot="1234567890"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <div className="bg-gray-100 p-8 text-center rounded">
            <p className="text-gray-500 text-sm">Google AdSense Placeholder</p>
            <p className="text-xs text-gray-400 mt-1">Configure NEXT_PUBLIC_GOOGLE_ADSENSE_ID</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}