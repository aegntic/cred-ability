/**
 * Type definition for the Exclusive Access application form data
 * This provides a consistent data structure across components 
 */
export interface ExclusiveAccessFormData {
  fullName: string;
  email: string;
  companyName: string;
  companySize: string;
  jobTitle?: string;
  industry?: string;
  useCase?: string;
  timeline?: string;
  referralSource?: string;
  linkedInUrl?: string;
  xProfileUrl?: string;
  websiteUrl?: string;
  agreeToTerms: boolean;
  agreeToMarketingCommunications?: boolean;
}
