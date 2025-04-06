/**
 * Types for the credential detection system
 */

export enum CredentialType {
  API_KEY = 'api_key',
  OAUTH_TOKEN = 'oauth_token',
  PERSONAL_ACCESS_TOKEN = 'personal_access_token',
  PASSWORD = 'password',
  AWS_ACCESS_KEY = 'aws_access_key',
  DATABASE_CONNECTION_STRING = 'database_connection_string',
  JWT = 'jwt',
  SSH_KEY = 'ssh_key',
  UNKNOWN = 'unknown'
}

export enum ServiceType {
  AWS = 'aws',
  GITHUB = 'github',
  GOOGLE_CLOUD = 'google_cloud',
  AZURE = 'azure',
  STRIPE = 'stripe',
  SALESFORCE = 'salesforce',
  JIRA = 'jira',
  DATABASE = 'database',
  GENERIC = 'generic',
  UNKNOWN = 'unknown'
}

export interface DetectedCredential {
  type: CredentialType;
  value: string;
  pattern: RegExp;
  matchedString: string;
  confidence: number;
  metadata: {
    service?: ServiceType;
    location?: string;
    context?: string;
    [key: string]: any;
  };
}

export interface CredentialDetectionResult {
  credentials: DetectedCredential[];
  confidence: number;
}

export interface CredentialClassification {
  credentialType: CredentialType;
  service: ServiceType;
  confidenceScore: number;
  riskLevel: RiskLevel;
  permissions?: string[];
  potentialUses?: string[];
}

export enum RiskLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  UNKNOWN = 'unknown'
}

export interface ContextualMetadata {
  url?: string;
  domain?: string;
  path?: string;
  pageTitle?: string;
  formAction?: string;
  inputName?: string;
  applicationType?: string;
  timestamp: string;
  relatedServices: ServiceType[];
  relatedCredentials: string[];
}

export interface SecurityRecommendation {
  type: RecommendationType;
  priority: PriorityLevel;
  description: string;
  action: string;
  impact: ImpactLevel;
}

export enum RecommendationType {
  ROTATION = 'rotation',
  SCOPE_REDUCTION = 'scope_reduction',
  ALTERNATIVE_AUTH = 'alternative_auth',
  ENVIRONMENT_VARIABLE = 'environment_variable',
  SECRET_MANAGER = 'secret_manager',
  ENCRYPTION = 'encryption',
  MFA = 'mfa',
  POLICY_CHANGE = 'policy_change'
}

export enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum ImpactLevel {
  BREAKING = 'breaking',
  MAJOR = 'major',
  MINOR = 'minor',
  NONE = 'none'
}
