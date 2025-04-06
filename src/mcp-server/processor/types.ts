/**
 * Types for the MCP Server credential processing
 */

// Import common types from browser integration
import {
  CredentialType,
  ServiceType,
  RiskLevel,
  CredentialClassification,
  SecurityRecommendation
} from '../../browser-integration/detection/types';

export { 
  CredentialType, 
  ServiceType, 
  RiskLevel, 
  CredentialClassification, 
  SecurityRecommendation 
};

export enum EventSource {
  BROWSER = 'browser',
  IDE = 'ide',
  CLI = 'cli',
  API = 'api',
  SYSTEM = 'system'
}

export interface CredentialEvent {
  id: string;
  source: EventSource;
  credential: {
    type: CredentialType;
    value: string;
    algorithm?: string;
    iv?: string;
  };
  context: {
    url?: string;
    domain?: string;
    timestamp: string;
    application?: string;
    metadata?: Record<string, any>;
  };
  confidence: number;
}

export interface CredentialDetection {
  id: string;
  type: CredentialType;
  confidence_score: number;
  risk_profile: {
    level: RiskLevel;
    factors: {
      factor: string;
      score: number;
      details: string;
    }[];
  };
}

export interface ContextGraph {
  service_dependencies: {
    service: ServiceType;
    dependency_type: 'direct' | 'indirect';
    confidence: number;
  }[];
  potential_vulnerabilities: {
    type: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    cve_id?: string;
  }[];
}

export interface MCPProcessingResult {
  detection: CredentialDetection;
  classification: CredentialClassification;
  context: ContextGraph;
  recommendations: SecurityRecommendation[];
  audit_log: {
    event_id: string;
    timestamp: string;
    action: string;
    result: 'success' | 'failure';
    details: Record<string, any>;
  };
}
