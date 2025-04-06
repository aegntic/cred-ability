import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../common/logger';
import {
  CredentialContext,
  ContextualAnalysis,
  ServiceMapping,
  UsagePattern,
  RelatedCredential,
  RiskFactor,
  RiskAssessment,
  ContextGraph,
  ContextGraphNode,
  ContextGraphEdge
} from './types';
import { ServiceType, RiskLevel } from '../../browser-integration/detection/types';

/**
 * Service for analyzing credential context and building contextual relationships
 */
export class ContextAnalyzer {
  // In-memory store of analyzed credentials for demo purposes
  private analyzedCredentials: Map<string, ContextualAnalysis>;
  
  constructor() {
    this.analyzedCredentials = new Map<string, ContextualAnalysis>();
    logger.info('Context analyzer initialized');
  }
  
  /**
   * Analyze the context of a credential
   * 
   * @param context Credential context to analyze
   * @returns Contextual analysis results
   */
  public analyzeContext(context: CredentialContext): ContextualAnalysis {
    logger.info('Analyzing credential context', {
      credentialId: context.credentialId,
      type: context.credentialType,
      service: context.service
    });
    
    // Map potential services
    const serviceMappings = this.mapServices(context);
    
    // Analyze usage patterns
    const usagePatterns = this.analyzeUsagePatterns(context);
    
    // Find related credentials
    const relatedCredentials = this.findRelatedCredentials(context);
    
    // Assess risk
    const riskAssessment = this.assessRisk(context);
    
    // Create the analysis result
    const analysis: ContextualAnalysis = {
      credentialId: context.credentialId,
      serviceMappings,
      usagePatterns,
      relatedCredentials,
      riskAssessment,
      analysisTimestamp: new Date().toISOString()
    };
    
    // Store the analysis
    this.analyzedCredentials.set(context.credentialId, analysis);
    
    return analysis;
  }
  
  /**
   * Retrieve previous analysis for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Previously analyzed context or null if not found
   */
  public getAnalysis(credentialId: string): ContextualAnalysis | null {
    return this.analyzedCredentials.get(credentialId) || null;
  }
  
  /**
   * Build a context graph for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Context graph representation
   */
  public buildContextGraph(credentialId: string): ContextGraph {
    logger.info('Building context graph', { credentialId });
    
    const analysis = this.analyzedCredentials.get(credentialId);
    
    if (!analysis) {
      logger.warn('No analysis found for credential', { credentialId });
      return { nodes: [], edges: [] };
    }
    
    const nodes: ContextGraphNode[] = [];
    const edges: ContextGraphEdge[] = [];
    
    // Add the credential node
    nodes.push({
      id: credentialId,
      type: 'credential',
      label: `Credential ${credentialId.substring(0, 8)}`,
      properties: {
        id: credentialId
      }
    });
    
    // Add service nodes and edges
    analysis.serviceMappings.forEach(mapping => {
      const serviceNodeId = `service-${mapping.service}`;
      
      // Add service node if not exists
      if (!nodes.some(node => node.id === serviceNodeId)) {
        nodes.push({
          id: serviceNodeId,
          type: 'service',
          label: mapping.service,
          properties: {
            service: mapping.service,
            details: mapping.details
          }
        });
      }
      
      // Add edge between credential and service
      edges.push({
        source: credentialId,
        target: serviceNodeId,
        type: 'accesses',
        weight: mapping.confidence,
        properties: {
          confidence: mapping.confidence
        }
      });
    });
    
    // Add application nodes and edges
    analysis.usagePatterns.forEach(pattern => {
      const appNodeId = `app-${pattern.application}`;
      
      // Add application node if not exists
      if (!nodes.some(node => node.id === appNodeId)) {
        nodes.push({
          id: appNodeId,
          type: 'application',
          label: pattern.application,
          properties: {
            application: pattern.application,
            frequency: pattern.frequency
          }
        });
      }
      
      // Add edge between credential and application
      edges.push({
        source: appNodeId,
        target: credentialId,
        type: 'uses',
        weight: this.frequencyToWeight(pattern.frequency),
        properties: {
          lastUsed: pattern.lastUsed,
          frequency: pattern.frequency
        }
      });
    });
    
    // Add related credential edges
    analysis.relatedCredentials.forEach(related => {
      // Add edge between credentials
      edges.push({
        source: credentialId,
        target: related.id,
        type: related.relationship === 'alternative' ? 'alternative-to' : 'depends-on',
        weight: related.strengthScore,
        properties: {
          relationship: related.relationship,
          strengthScore: related.strengthScore
        }
      });
    });
    
    return { nodes, edges };
  }
  
  /**
   * Map potential services for a credential
   * 
   * @param context Credential context
   * @returns Array of service mappings
   */
  private mapServices(context: CredentialContext): ServiceMapping[] {
    const mappings: ServiceMapping[] = [];
    
    // Always include the primary service
    mappings.push({
      service: context.service,
      confidence: 0.95,
      details: this.getServiceDetails(context.service)
    });
    
    // Add additional potential services based on domain or credential type
    if (context.detectionDomain) {
      const domainServices = this.mapDomainToServices(context.detectionDomain);
      
      domainServices.forEach(service => {
        // Only add if it's not already the primary service
        if (service.service !== context.service) {
          mappings.push(service);
        }
      });
    }
    
    return mappings;
  }
  
  /**
   * Get service details based on service type
   * 
   * @param service Service type
   * @returns Service details
   */
  private getServiceDetails(service: ServiceType): Record<string, any> {
    switch (service) {
      case ServiceType.AWS:
        return {
          region: 'us-west-2', // Example, would be derived from actual data
          serviceType: 'ec2' // Example
        };
        
      case ServiceType.GITHUB:
        return {
          repoAccess: true,
          orgAdmin: false
        };
        
      case ServiceType.DATABASE:
        return {
          databaseType: 'postgresql',
          readOnly: false
        };
        
      default:
        return {};
    }
  }
  
  /**
   * Map a domain to potential services
   * 
   * @param domain Domain name
   * @returns Array of potential service mappings
   */
  private mapDomainToServices(domain: string): ServiceMapping[] {
    const mappings: ServiceMapping[] = [];
    
    // Map common domains to services
    if (domain.includes('github.com')) {
      mappings.push({
        service: ServiceType.GITHUB,
        confidence: 0.9,
        details: {
          domain: 'github.com'
        }
      });
    } else if (domain.includes('aws.amazon.com')) {
      mappings.push({
        service: ServiceType.AWS,
        confidence: 0.9,
        details: {
          domain: 'aws.amazon.com'
        }
      });
    } else if (domain.includes('stripe.com')) {
      mappings.push({
        service: ServiceType.STRIPE,
        confidence: 0.9,
        details: {
          domain: 'stripe.com'
        }
      });
    }
    
    return mappings;
  }
  
  /**
   * Analyze usage patterns for a credential
   * 
   * @param context Credential context
   * @returns Array of usage patterns
   */
  private analyzeUsagePatterns(context: CredentialContext): UsagePattern[] {
    // In a real implementation, this would analyze historical usage data
    // For this demo, we'll create some example patterns
    
    const patterns: UsagePattern[] = [];
    
    // Add a pattern based on detection source
    patterns.push({
      application: context.detectionSource || 'unknown',
      frequency: 'daily', // Example frequency
      lastUsed: context.timestamp,
      contexts: context.detectionDomain ? [context.detectionDomain] : []
    });
    
    // Add additional patterns based on credential type and service
    if (context.service === ServiceType.AWS) {
      patterns.push({
        application: 'CI/CD pipeline',
        frequency: 'continuous',
        lastUsed: new Date().toISOString(),
        contexts: ['deployment', 'automation']
      });
    } else if (context.service === ServiceType.GITHUB) {
      patterns.push({
        application: 'Git operations',
        frequency: 'daily',
        lastUsed: new Date().toISOString(),
        contexts: ['repository', 'code']
      });
    }
    
    return patterns;
  }
  
  /**
   * Find credentials related to the given context
   * 
   * @param context Credential context
   * @returns Array of related credentials
   */
  private findRelatedCredentials(context: CredentialContext): RelatedCredential[] {
    const relatedCredentials: RelatedCredential[] = [];
    
    // In a real implementation, this would search the credential database
    // For this demo, we'll create some example relations
    
    // Add a randomly generated related credential of the same service
    relatedCredentials.push({
      id: uuidv4(),
      relationship: 'same-service',
      strengthScore: 0.8
    });
    
    return relatedCredentials;
  }
  
  /**
   * Assess the risk profile of a credential
   * 
   * @param context Credential context
   * @returns Risk assessment
   */
  private assessRisk(context: CredentialContext): RiskAssessment {
    const factors: RiskFactor[] = [];
    
    // Risk factor based on credential type
    let typeRiskScore = 0.3;
    let typeRiskDetails = 'Standard credential type';
    
    switch (context.credentialType) {
      case 'aws_access_key':
        typeRiskScore = 0.9;
        typeRiskDetails = 'AWS keys typically have broad permissions';
        break;
        
      case 'database_connection_string':
        typeRiskScore = 0.8;
        typeRiskDetails = 'Database credentials provide direct data access';
        break;
        
      case 'api_key':
        typeRiskScore = 0.6;
        typeRiskDetails = 'API keys may have varying permission levels';
        break;
    }
    
    factors.push({
      factor: 'credential_type',
      score: typeRiskScore,
      details: typeRiskDetails
    });
    
    // Risk factor based on detection location
    let exposureRiskScore = 0.1;
    let exposureRiskDetails = 'Low-risk detection location';
    
    if (context.detectionUrl) {
      if (context.detectionUrl.includes('github.com')) {
        exposureRiskScore = 0.9;
        exposureRiskDetails = 'Detected in a public repository';
      } else if (context.detectionDomain?.includes('localhost')) {
        exposureRiskScore = 0.2;
        exposureRiskDetails = 'Detected in local development environment';
      }
    }
    
    factors.push({
      factor: 'exposure_location',
      score: exposureRiskScore,
      details: exposureRiskDetails
    });
    
    // Calculate overall risk score as weighted average
    const weights = {
      credential_type: 0.6,
      exposure_location: 0.4
    };
    
    let overallScore = 0;
    let totalWeight = 0;
    
    factors.forEach(factor => {
      const weight = (weights as Record<string, number>)[factor.factor] || 0.5;
      overallScore += factor.score * weight;
      totalWeight += weight;
    });
    
    overallScore = totalWeight > 0 ? overallScore / totalWeight : 0.5;
    
    return {
      overallScore,
      factors
    };
  }
  
  /**
   * Convert usage frequency to a numeric weight
   * 
   * @param frequency Usage frequency
   * @returns Weight value
   */
  private frequencyToWeight(frequency: string): number {
    switch (frequency) {
      case 'continuous':
        return 1.0;
      case 'daily':
        return 0.8;
      case 'occasional':
        return 0.5;
      case 'rare':
        return 0.2;
      default:
        return 0.5;
    }
  }
}
