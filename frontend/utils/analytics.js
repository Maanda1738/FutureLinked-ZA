import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Log page views
export const logPageView = (url) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Log specific events
export const logEvent = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Log search events
export const logSearch = (query, resultsCount) => {
  logEvent({
    action: 'search',
    category: 'engagement',
    label: query,
    value: resultsCount,
  });
};

// Log job clicks
export const logJobClick = (jobTitle, company, source) => {
  logEvent({
    action: 'job_click',
    category: 'conversion',
    label: `${jobTitle} - ${company} (${source})`,
  });
};

// Log ad clicks
export const logAdClick = (adType, placement) => {
  logEvent({
    action: 'ad_click',
    category: 'monetization',
    label: `${adType} - ${placement}`,
  });
};

// Hook for page tracking
export const usePageTracking = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      logPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
};