import { useEffect } from 'react';

/**
 * Google AdSense Component
 * Displays AdSense ads with Auto ads support
 * 
 * @param {string} adSlot - Optional: Specific ad slot ID for manual ad units
 * @param {string} adFormat - Ad format: 'auto', 'fluid', 'rectangle', etc.
 * @param {string} className - Additional CSS classes
 * @param {string} style - Inline styles for the ad container
 */
export default function AdSense({ 
  adSlot = null, 
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style = {}
}) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Auto ads - no manual insertion needed, AdSense handles placement
  if (!adSlot) {
    return null; // Auto ads work automatically via the script in _document.js
  }

  // Manual ad unit
  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-3075043359765193"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * In-Feed Ad Component
 * Perfect for job listings and search results
 */
export function InFeedAd({ className = '' }) {
  return (
    <AdSense
      adFormat="fluid"
      className={`my-4 ${className}`}
      style={{ minHeight: '200px' }}
    />
  );
}

/**
 * Display Ad Component
 * Rectangular ads for sidebars and content areas
 */
export function DisplayAd({ className = '' }) {
  return (
    <AdSense
      adFormat="auto"
      className={`my-6 ${className}`}
      style={{ minHeight: '250px' }}
    />
  );
}

/**
 * Horizontal Ad Component
 * Banner ads for headers and between sections
 */
export function HorizontalAd({ className = '' }) {
  return (
    <AdSense
      adFormat="horizontal"
      className={`my-4 w-full ${className}`}
      style={{ minHeight: '90px' }}
    />
  );
}

/**
 * Article Ad Component
 * Ads for content pages and articles
 */
export function ArticleAd({ className = '' }) {
  return (
    <AdSense
      adFormat="fluid"
      className={`my-6 ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
}
