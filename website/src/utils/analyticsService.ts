/**
 * Analytics service for CRED-ABILITY
 * Tracks user interactions, form submissions, and application usage
 */

import { ExclusiveAccessFormData } from '../types/form-types';

// Initialize analytics with appropriate config
export const initAnalytics = () => {
  console.log('Analytics service initialized');
  
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    });
  }
};

// Track general events
export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  console.log(`Analytics Event: ${eventName}`, eventParams);
  
  // In production, this would send the event to your analytics provider
  // Example: window.gtag('event', eventName, eventParams);
};

// Track form submissions
export const trackFormSubmission = (formType: string, formData: Record<string, any>) => {
  // Remove sensitive information before logging
  const sanitizedData = { ...formData };
  
  // Redact sensitive fields
  if ('email' in sanitizedData) sanitizedData.email = '[REDACTED]';
  if ('companyEmail' in sanitizedData) sanitizedData.companyEmail = '[REDACTED]';
  
  trackEvent('form_submission', {
    form_type: formType,
    form_data: sanitizedData
  });
};

// Track access request
export const trackAccessRequest = (formData: ExclusiveAccessFormData) => {
  const companySize = formData.companySize;
  const hasLinkedIn = !!formData.linkedInUrl;
  const hasTwitter = !!formData.xProfileUrl;
  const hasWebsite = !!formData.websiteUrl;
  const acceptedMarketing = formData.agreeToMarketingCommunications;
  
  trackEvent('access_request', {
    company_size: companySize,
    has_linkedin: hasLinkedIn,
    has_twitter: hasTwitter,
    has_website: hasWebsite,
    accepted_marketing: acceptedMarketing,
    industry: formData.industry || 'not_specified'
  });
};

// Track feature interactions
export const trackFeatureInteraction = (featureName: string, action: string) => {
  trackEvent('feature_interaction', {
    feature: featureName,
    action: action,
    timestamp: new Date().toISOString()
  });
};
