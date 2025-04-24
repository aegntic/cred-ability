// Service for handling access requests
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { ExclusiveAccessFormData } from '../components/sections/exclusive-access-section';
import { trackAccessRequest } from '../utils/analyticsService';
import notificationService from './notificationService';
import { maskSensitiveData } from '../utils/securityUtils';

// Enhanced form data interface with additional requested fields
export interface EnhancedAccessFormData extends ExclusiveAccessFormData {
  submittedAt?: any;
  status?: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  accessCode?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

/**
 * Saves the access request form data to Firestore
 * @param formData The form data to save
 * @returns A promise that resolves with the document reference
 */
export const saveAccessRequest = async (formData: ExclusiveAccessFormData) => {
  try {
    // Check if email is already registered
    const existingQuery = query(
      collection(db, 'accessRequests'),
      where('email', '==', formData.email),
      limit(1)
    );
    
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      notificationService.warning(
        'This email is already registered for the beta program. We\'ll contact you soon with access details.',
        'Already Registered'
      );
      return existingDocs.docs[0].ref;
    }
    
    // Generate a unique access code
    const accessCode = generateAccessCode();
    
    // Add timestamp and status
    const enhancedData: EnhancedAccessFormData = {
      ...formData,
      submittedAt: serverTimestamp(),
      status: 'pending',
      accessCode
    };
    
    // Track the access request (analytics)
    trackAccessRequest(formData);
    
    // Save to Firestore 'accessRequests' collection
    const docRef = await addDoc(
      collection(db, 'accessRequests'),
      enhancedData
    );
    
    console.log('Access request saved with ID:', docRef.id);
    logAccessRequest(enhancedData);
    
    // Show success notification
    notificationService.success(
      'Your request has been successfully submitted. We\'ll review it shortly!',
      'Request Received'
    );
    
    return {
      docRef,
      accessCode
    };
  } catch (error) {
    console.error('Error saving access request:', error);
    
    // Show error notification
    notificationService.error(
      'There was a problem submitting your request. Please try again.',
      'Submission Error'
    );
    
    throw error;
  }
};

/**
 * Validates form data before submission
 * @param formData The form data to validate
 * @returns An object containing validation result and any error messages
 */
export const validateAccessRequest = (formData: ExclusiveAccessFormData) => {
  const errors: Record<string, string> = {};
  
  // Basic email validation
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Company email validation (should be different from personal email)
  if (
    formData.companyEmail && 
    formData.companyEmail === formData.email
  ) {
    errors.companyEmail = 'Company email should be different from personal email';
  }
  
  // LinkedIn URL validation
  if (
    formData.linkedInUrl && 
    !formData.linkedInUrl.includes('linkedin.com/')
  ) {
    errors.linkedInUrl = 'Please enter a valid LinkedIn URL';
  }
  
  // X (Twitter) profile validation
  if (
    formData.xProfileUrl && 
    !formData.xProfileUrl.includes('twitter.com/') && 
    !formData.xProfileUrl.includes('x.com/')
  ) {
    errors.xProfileUrl = 'Please enter a valid X (Twitter) profile URL';
  }
  
  // Website URL validation
  if (
    formData.websiteUrl && 
    !formData.websiteUrl.startsWith('http')
  ) {
    errors.websiteUrl = 'Please enter a valid website URL starting with http:// or https://';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Generate a unique access code
 * @returns A unique access code
 */
const generateAccessCode = (): string => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
  const length = 8;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Format as XXXX-XXXX for readability
  return `${result.substring(0, 4)}-${result.substring(4, 8)}`;
};

/**
 * Log access request details (for debugging, with sensitive data masked)
 * @param data The access request data
 */
const logAccessRequest = (data: EnhancedAccessFormData): void => {
  // Create a sanitized copy for logging
  const sanitizedData = { ...data };
  
  // Mask sensitive fields
  if (sanitizedData.email) {
    sanitizedData.email = maskSensitiveData(sanitizedData.email);
  }
  
  if (sanitizedData.companyEmail) {
    sanitizedData.companyEmail = maskSensitiveData(sanitizedData.companyEmail);
  }
  
  // Log sanitized data
  console.log('Access request received:', {
    name: sanitizedData.fullName,
    company: sanitizedData.companyName,
    companySize: sanitizedData.companySize,
    hasLinkedIn: !!sanitizedData.linkedInUrl,
    hasXProfile: !!sanitizedData.xProfileUrl,
    accessCode: sanitizedData.accessCode,
    timestamp: new Date().toISOString()
  });
};
