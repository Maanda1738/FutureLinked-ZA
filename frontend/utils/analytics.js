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

// Log template downloads
export const logTemplateDownload = (templateType) => {
  logEvent({
    action: 'download_template',
    category: 'engagement',
    label: templateType,
    value: 1,
  });
};

// Log job saves
export const logJobSave = (jobTitle, company) => {
  logEvent({
    action: 'save_job',
    category: 'engagement',
    label: `${jobTitle} - ${company}`,
  });
};

// Log social shares
export const logShare = (contentType, contentTitle, platform) => {
  logEvent({
    action: 'share',
    category: 'engagement',
    label: `${contentType}: ${contentTitle} via ${platform}`,
  });
};

// Log blog post views
export const logBlogView = (postSlug, postTitle, category) => {
  logEvent({
    action: 'view_blog_post',
    category: 'content',
    label: `${category}: ${postTitle}`,
  });
};

// Log email signups
export const logEmailSignup = (source) => {
  logEvent({
    action: 'email_signup',
    category: 'conversion',
    label: source,
    value: 2,
  });
};

// Log social media clicks
export const logSocialClick = (platform, action) => {
  logEvent({
    action: 'social_click',
    category: 'engagement',
    label: `${platform} - ${action}`,
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