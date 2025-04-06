/**
 * Types for the intelligence layer context analysis
 */

import { CredentialType, ServiceType, RiskLevel } from '../../browser-integration/detection/types';

export interface CredentialContext {
  credentialId: string;
  credentialType: CredentialType;
  service: ServiceType;
  detectionSource: string;
  detectionUrl?: string;
  detectionDomain?: string;
  confidence: number;
  riskLevel: RiskLevel;
  timestamp: string;
}

export interface ServiceMapping {
  service: ServiceType;
  confidence: number;
  details: {
    region?: string;
    serviceType?: string;
    [key: string]: any;
  };
}

export interface UsagePattern {
  application: string;
  frequency: 'rare' | 'occasional' | 'daily' | 'continuous';
  lastUsed: string; // ISO timestamp
  contexts: string[];
}

export interface RelatedCredential {
  id: string;
  relationship: 'same-service' | 'same-application' | 'dependency' | 'alternative';
  strengthScore: number;
}

export interface RiskFactor {
  factor: string;
  score: number;
  details: string;
}

export interface RiskAssessment {
  overallScore: number;
  factors: RiskFactor[];
}

export interface ContextualAnalysis {
  credentialId: string;
  serviceMappings: ServiceMapping[];
  usagePatterns: UsagePattern[];
  relatedCredentials: RelatedCredential[];
  riskAssessment: RiskAssessment;
  analysisTimestamp: string;
}

export interface ContextGraphNode {
  id: string;
  type: 'credential' | 'service' | 'application' | 'domain';
  label: string;
  properties: Record<string, any>;
}

export interface ContextGraphEdge {
  source: string;
  target: string;
  type: 'uses' | 'accesses' | 'depends-on' | 'alternative-to' | 'rotated-from';
  weight: number;
  properties: Record<string, any>;
}

export interface ContextGraph {
  nodes: ContextGraphNode[];
  edges: ContextGraphEdge[];
}
