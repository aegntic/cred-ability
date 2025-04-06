/**
 * Types for the intelligence layer recommendation system
 */

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

export interface SecurityRecommendation {
  id: string;
  credentialId: string;
  type: RecommendationType;
  priority: PriorityLevel;
  description: string;
  action: string;
  impact: ImpactLevel;
  benefits: string[];
  implementation: string;
  createdAt: string;
  status: RecommendationStatus;
}

export enum RecommendationStatus {
  PENDING = 'pending',
  IMPLEMENTED = 'implemented',
  DISMISSED = 'dismissed',
  IN_PROGRESS = 'in_progress'
}

export interface RotationPlan {
  credentialId: string;
  recommendedSchedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRotation: string; // ISO timestamp
  };
  rotationSteps: string[];
  potentialImpact: string;
}

export interface AccessScopeRecommendation {
  credentialId: string;
  currentScope: string[];
  recommendedScope: string[];
  excessivePermissions: string[];
  justification: string;
}

export interface SecurityImprovement {
  type: RecommendationType;
  title: string;
  description: string;
  implementation: string;
  difficulty: 'easy' | 'medium' | 'complex';
  securityImpact: 'low' | 'medium' | 'high';
}
