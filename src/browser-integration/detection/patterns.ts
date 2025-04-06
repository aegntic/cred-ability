import { CredentialType, ServiceType } from './types';

interface DetectionPattern {
  pattern: RegExp;
  type: CredentialType;
  service?: ServiceType;
  confidenceBase: number;
  validator?: (match: string) => boolean;
  metadataExtractor?: (match: string, fullText: string) => Record<string, any>;
}

/**
 * Registry of credential detection patterns
 * 
 * Each pattern includes:
 * - Regular expression for detection
 * - Credential type classification
 * - Service association (if determinable)
 * - Base confidence score (adjusted during detection)
 * - Optional validator function for reducing false positives
 * - Optional metadata extractor for additional context
 */
export const detectionPatterns: DetectionPattern[] = [
  // OAuth Tokens
  {
    pattern: /oauth_token\s*=\s*['"]([^'"]+)['"]/i,
    type: CredentialType.OAUTH_TOKEN,
    confidenceBase: 0.8,
    validator: (match) => match.length > 10,
    metadataExtractor: (match, fullText) => {
      // Try to identify the service from surrounding text
      const serviceMatches = {
        github: /github/i,
        google: /google/i,
        azure: /azure|microsoft/i,
        salesforce: /salesforce/i,
        jira: /jira|atlassian/i
      };
      
      let service = ServiceType.UNKNOWN;
      
      for (const [key, regex] of Object.entries(serviceMatches)) {
        if (regex.test(fullText)) {
          service = key as ServiceType;
          break;
        }
      }
      
      return { service };
    }
  },
  
  // Generic API Keys
  {
    pattern: /(?:api_key|apikey|api[-_]?key|access[-_]?key)\s*[=:]\s*['"]([^'"]{16,})['"]/i,
    type: CredentialType.API_KEY,
    confidenceBase: 0.7,
    validator: (match) => {
      // API keys typically have mixed case, numbers, and are longer than 16 chars
      return match.length >= 16 && /[A-Z]/.test(match) && /[a-z]/.test(match) && /\d/.test(match);
    }
  },
  
  // Personal Access Tokens
  {
    pattern: /(?:pat|personal[-_]?access[-_]?token|access[-_]?token)\s*[=:]\s*['"]([^'"]{10,})['"]/i,
    type: CredentialType.PERSONAL_ACCESS_TOKEN,
    confidenceBase: 0.75,
    validator: (match) => match.length >= 10 && /^[a-zA-Z0-9_\-]+$/.test(match)
  },
  
  // AWS Access Keys
  {
    pattern: /AKIA[0-9A-Z]{16}/,
    type: CredentialType.AWS_ACCESS_KEY,
    service: ServiceType.AWS,
    confidenceBase: 0.9,
    validator: (match) => match.length === 20 && match.startsWith('AKIA')
  },
  
  // AWS Secret Keys
  {
    pattern: /(?:aws_secret_access_key|aws_secret_key)\s*[=:]\s*['"]([^'"]{40})['"]/i,
    type: CredentialType.API_KEY,
    service: ServiceType.AWS,
    confidenceBase: 0.85,
    validator: (match) => match.length === 40 && /^[a-zA-Z0-9/+]+$/.test(match)
  },
  
  // GitHub tokens
  {
    pattern: /(?:github|gh)_(?:token|pat)\s*[=:]\s*['"]([^'"]+)['"]/i,
    type: CredentialType.PERSONAL_ACCESS_TOKEN,
    service: ServiceType.GITHUB,
    confidenceBase: 0.85,
    validator: (match) => match.startsWith('ghp_') || match.startsWith('github_pat_')
  },
  
  // Database connection strings
  {
    pattern: /(?:(?:mongodb|postgres|mysql|oracle|sqlserver|jdbc):(?:\/\/|@)[^'"<>]+)/i,
    type: CredentialType.DATABASE_CONNECTION_STRING,
    service: ServiceType.DATABASE,
    confidenceBase: 0.9,
    validator: (match) => {
      // Basic validation that it looks like a connection string
      return match.includes('@') || match.includes('//')
        && (match.includes('password') || match.includes('pwd') || match.includes(':') && match.includes('@'));
    },
    metadataExtractor: (match) => {
      // Extract database type
      let dbType = 'unknown';
      const dbMatches = /^(mongodb|postgres|mysql|oracle|sqlserver|jdbc):/.exec(match);
      
      if (dbMatches && dbMatches[1]) {
        dbType = dbMatches[1];
      }
      
      return { databaseType: dbType };
    }
  },
  
  // JWT Tokens
  {
    pattern: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/,
    type: CredentialType.JWT,
    confidenceBase: 0.8,
    validator: (match) => {
      // Basic JWT format validation
      const parts = match.split('.');
      return parts.length === 3 && parts.every(part => part.length > 10);
    }
  },
  
  // SSH Private Keys
  {
    pattern: /-----BEGIN (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----[^]*?-----END (?:RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/,
    type: CredentialType.SSH_KEY,
    confidenceBase: 0.95,
    validator: (match) => {
      // SSH key should have multiple lines and contain specific markers
      return match.includes('\n') && match.includes('PRIVATE KEY');
    }
  },
  
  // Stripe API Keys
  {
    pattern: /sk_(?:test|live)_[0-9a-zA-Z]{24}/,
    type: CredentialType.API_KEY,
    service: ServiceType.STRIPE,
    confidenceBase: 0.9,
    validator: (match) => match.startsWith('sk_') && (match.includes('test') || match.includes('live'))
  },
  
  // Google API Keys
  {
    pattern: /AIza[0-9A-Za-z-_]{35}/,
    type: CredentialType.API_KEY,
    service: ServiceType.GOOGLE_CLOUD,
    confidenceBase: 0.8,
    validator: (match) => match.startsWith('AIza') && match.length === 39
  },
  
  // Azure Secrets/Keys
  {
    pattern: /(?:azure|ms)_(?:key|secret|password|token)[\s\r\n]*[=:]+[\s\r\n]*['"][^'"]{10,}['"]?/i,
    type: CredentialType.API_KEY,
    service: ServiceType.AZURE,
    confidenceBase: 0.75,
    validator: (match) => match.length > 20
  }
];

/**
 * Get all registered detection patterns
 * 
 * @returns Array of detection pattern objects
 */
export function getDetectionPatterns(): DetectionPattern[] {
  return detectionPatterns;
}

/**
 * Add a custom detection pattern
 * 
 * @param pattern The detection pattern object to add
 * @returns The updated array of patterns
 */
export function addDetectionPattern(pattern: DetectionPattern): DetectionPattern[] {
  detectionPatterns.push(pattern);
  return detectionPatterns;
}
