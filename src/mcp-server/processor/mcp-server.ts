import { v4 as uuidv4 } from 'uuid';
import { logger, maskCredential } from '../../common/logger';
import {
  CredentialEvent,
  CredentialDetection,
  CredentialClassification,
  ContextGraph,
  MCPProcessingResult,
  EventSource,
  CredentialType,
  ServiceType,
  RiskLevel,
  SecurityRecommendation
} from './types';

/**
 * Model Context Protocol (MCP) Server
 * 
 * Central processing class for credential events as specified in the SRS.
 * Coordinates the detection, classification, context building, and recommendation
 * generation for credential events from various sources.
 */
export class MCPServer {
  /**
   * Process a credential event through the MCP pipeline
   * 
   * @param event The credential event to process
   * @returns Processing result with recommendations
   */
  public async process_credential_event(event: CredentialEvent): Promise<MCPProcessingResult> {
    logger.info('Processing credential event', {
      eventId: event.id,
      source: event.source,
      credentialType: event.credential.type,
      domain: event.context.domain || 'unknown'
    });
    
    try {
      // 1. Detect and validate credential
      const detection = this.detect_credential(event);
      
      // 2. Classify credential
      const classification = this.classify_credential(detection);
      
      // 3. Build context graph
      const context = this.build_context_graph(classification);
      
      // 4. Generate recommendations
      const recommendations = this.generate_recommendations(context);
      
      // 5. Create audit log
      const auditLog = this.create_audit_entry(event);
      
      // 6. Return complete result
      return {
        detection,
        classification,
        context,
        recommendations,
        audit_log: auditLog
      };
    } catch (error) {
      logger.error('Error processing credential event', {
        eventId: event.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }
  
  /**
   * Detect and validate a credential from an event
   * 
   * @param event The credential event
   * @returns Credential detection result
   */
  public detect_credential(event: CredentialEvent): CredentialDetection {
    logger.debug('Detecting credential', {
      eventId: event.id,
      credentialType: event.credential.type
    });
    
    // Create risk factors based on credential type and context
    const riskFactors = this.assess_risk_factors(event);
    
    // Calculate overall risk level
    const riskLevel = this.calculate_risk_level(riskFactors);
    
    return {
      id: event.id,
      type: event.credential.type,
      confidence_score: event.confidence,
      risk_profile: {
        level: riskLevel,
        factors: riskFactors
      }
    };
  }
  
  /**
   * Classify a detected credential
   * 
   * @param detection The credential detection
   * @returns Credential classification
   */
  public classify_credential(detection: CredentialDetection): CredentialClassification {
    logger.debug('Classifying credential', {
      detectionId: detection.id,
      credentialType: detection.type
    });
    
    // Map potential services based on credential type
    const service = this.map_potential_service(detection.type);
    
    // Analyze permission scope
    const permissions = this.analyze_permission_scope(detection.type, service);
    
    // Predict use scenarios
    const potentialUses = this.predict_use_scenarios(detection.type, service);
    
    return {
      credentialType: detection.type,
      service,
      confidenceScore: detection.confidence_score,
      riskLevel: detection.risk_profile.level,
      permissions,
      potentialUses
    };
  }
  
  /**
   * Build a context graph for a classified credential
   * 
   * @param classification The credential classification
   * @returns Context graph with dependencies and vulnerabilities
   */
  public build_context_graph(classification: CredentialClassification): ContextGraph {
    logger.debug('Building context graph', {
      credentialType: classification.credentialType,
      service: classification.service
    });
    
    // Map service dependencies
    const serviceDependencies = this.map_dependencies(classification);
    
    // Identify potential vulnerabilities
    const potentialVulnerabilities = this.identify_vulnerabilities(classification);
    
    return {
      service_dependencies: serviceDependencies,
      potential_vulnerabilities: potentialVulnerabilities
    };
  }
  
  /**
   * Generate security recommendations
   * 
   * @param context The context graph
   * @returns Array of security recommendations
   */
  public generate_recommendations(context: ContextGraph): SecurityRecommendation[] {
    logger.debug('Generating recommendations', {
      vulnerabilitiesCount: context.potential_vulnerabilities.length
    });
    
    const recommendations: SecurityRecommendation[] = [];
    
    // Generate rotation strategy recommendations
    const rotationRecs = this.suggest_rotation_strategy(context);
    if (rotationRecs) {
      recommendations.push(rotationRecs);
    }
    
    // Generate access scope recommendations
    const accessRecs = this.optimize_access_scope(context);
    if (accessRecs) {
      recommendations.push(accessRecs);
    }
    
    // Generate security improvement recommendations
    const securityRecs = this.identify_security_upgrades(context);
    recommendations.push(...securityRecs);
    
    return recommendations;
  }
  
  /**
   * Create an audit log entry for a credential event
   * 
   * @param event The credential event
   * @returns Audit log entry
   */
  public create_audit_entry(event: CredentialEvent): {
    event_id: string;
    timestamp: string;
    action: string;
    result: 'success' | 'failure';
    details: Record<string, any>;
  } {
    return {
      event_id: uuidv4(),
      timestamp: new Date().toISOString(),
      action: 'credential_detection',
      result: 'success',
      details: {
        source: event.source,
        credential_type: event.credential.type,
        domain: event.context.domain || 'unknown',
        confidence: event.confidence
      }
    };
  }
  
  /**
   * Assess risk factors for a credential event
   * 
   * @param event The credential event
   * @returns Array of risk factors with scores
   */
  private assess_risk_factors(event: CredentialEvent): {
    factor: string;
    score: number;
    details: string;
  }[] {
    const factors = [];
    
    // Credential type risk
    let typeRiskScore = 0.5;
    let typeRiskDetails = 'Standard credential type';
    
    switch (event.credential.type) {
      case CredentialType.AWS_ACCESS_KEY:
        typeRiskScore = 0.9;
        typeRiskDetails = 'AWS Access Key with potentially broad permissions';
        break;
      case CredentialType.DATABASE_CONNECTION_STRING:
        typeRiskScore = 0.95;
        typeRiskDetails = 'Database connection string with full database access';
        break;
      case CredentialType.SSH_KEY:
        typeRiskScore = 0.9;
        typeRiskDetails = 'SSH key with potential server access';
        break;
      case CredentialType.API_KEY:
        typeRiskScore = 0.7;
        typeRiskDetails = 'API key with service access';
        break;
      case CredentialType.PERSONAL_ACCESS_TOKEN:
        typeRiskScore = 0.8;
        typeRiskDetails = 'Personal access token with user-level permissions';
        break;
    }
    
    factors.push({
      factor: 'credential_type',
      score: typeRiskScore,
      details: typeRiskDetails
    });
    
    // Exposure context risk
    let exposureRiskScore = 0.3;
    let exposureRiskDetails = 'Limited exposure context';
    
    if (event.source === EventSource.BROWSER) {
      if (event.context.url?.includes('github.com')) {
        exposureRiskScore = 0.9;
        exposureRiskDetails = 'Credential exposed in public GitHub repository';
      } else if (event.context.url?.includes('gitlab.com')) {
        exposureRiskScore = 0.9;
        exposureRiskDetails = 'Credential exposed in public GitLab repository';
      } else if (event.context.domain?.includes('localhost')) {
        exposureRiskScore = 0.2;
        exposureRiskDetails = 'Credential used in local development environment';
      }
    } else if (event.source === EventSource.IDE) {
      exposureRiskScore = 0.5;
      exposureRiskDetails = 'Credential detected in source code';
    }
    
    factors.push({
      factor: 'exposure_context',
      score: exposureRiskScore,
      details: exposureRiskDetails
    });
    
    // Additional factors based on specific characteristics
    if (event.credential.value && !event.credential.algorithm) {
      // Plaintext credential storage
      factors.push({
        factor: 'storage_security',
        score: 0.8,
        details: 'Credential stored in plaintext'
      });
    }
    
    return factors;
  }
  
  /**
   * Calculate overall risk level based on risk factors
   * 
   * @param factors Risk factors with scores
   * @returns Overall risk level
   */
  private calculate_risk_level(factors: {
    factor: string;
    score: number;
    details: string;
  }[]): RiskLevel {
    // Calculate weighted average of risk scores
    let totalScore = 0;
    let maxScore = 0;
    
    for (const factor of factors) {
      totalScore += factor.score;
      
      // Track highest individual risk score for critical risks
      if (factor.score > maxScore) {
        maxScore = factor.score;
      }
    }
    
    const avgScore = totalScore / factors.length;
    
    // Determine risk level based on scores
    if (maxScore >= 0.9) {
      return RiskLevel.CRITICAL;
    } else if (avgScore >= 0.7) {
      return RiskLevel.HIGH;
    } else if (avgScore >= 0.4) {
      return RiskLevel.MEDIUM;
    } else {
      return RiskLevel.LOW;
    }
  }
  
  /**
   * Map a credential type to potential service
   * 
   * @param type Credential type
   * @returns Service type
   */
  private map_potential_service(type: CredentialType): ServiceType {
    switch (type) {
      case CredentialType.AWS_ACCESS_KEY:
        return ServiceType.AWS;
      case CredentialType.DATABASE_CONNECTION_STRING:
        return ServiceType.DATABASE;
      // Additional mappings would be made here
      default:
        return ServiceType.GENERIC;
    }
  }
  
  /**
   * Analyze permission scope for a credential
   * 
   * @param type Credential type
   * @param service Service type
   * @returns Array of permissions
   */
  private analyze_permission_scope(type: CredentialType, service: ServiceType): string[] {
    const permissions: string[] = [];
    
    switch (service) {
      case ServiceType.AWS:
        permissions.push('AWS:*');
        if (type === CredentialType.AWS_ACCESS_KEY) {
          permissions.push('IAM:*');
          permissions.push('S3:*');
          permissions.push('EC2:*');
        }
        break;
        
      case ServiceType.GITHUB:
        if (type === CredentialType.PERSONAL_ACCESS_TOKEN) {
          permissions.push('repo:*');
          permissions.push('user:*');
        }
        break;
        
      case ServiceType.DATABASE:
        if (type === CredentialType.DATABASE_CONNECTION_STRING) {
          permissions.push('READ');
          permissions.push('WRITE');
          permissions.push('DELETE');
        }
        break;
        
      default:
        permissions.push('unknown:*');
    }
    
    return permissions;
  }
  
  /**
   * Predict potential use scenarios for a credential
   * 
   * @param type Credential type
   * @param service Service type
   * @returns Array of potential uses
   */
  private predict_use_scenarios(type: CredentialType, service: ServiceType): string[] {
    const uses: string[] = [];
    
    // Common uses by credential type
    switch (type) {
      case CredentialType.API_KEY:
        uses.push('API Access');
        uses.push('Service Authentication');
        break;
        
      case CredentialType.PERSONAL_ACCESS_TOKEN:
        uses.push('Repository Access');
        uses.push('CI/CD Integration');
        break;
        
      case CredentialType.OAUTH_TOKEN:
        uses.push('User Authentication');
        uses.push('Delegated Access');
        break;
        
      case CredentialType.AWS_ACCESS_KEY:
        uses.push('AWS Service Access');
        uses.push('Resource Management');
        break;
        
      case CredentialType.DATABASE_CONNECTION_STRING:
        uses.push('Database Access');
        uses.push('Data Retrieval and Manipulation');
        break;
    }
    
    // Additional uses by service
    switch (service) {
      case ServiceType.AWS:
        uses.push('Cloud Infrastructure Management');
        break;
        
      case ServiceType.GITHUB:
        uses.push('Source Code Access');
        uses.push('Webhook Management');
        break;
        
      case ServiceType.STRIPE:
        uses.push('Payment Processing');
        uses.push('Customer Management');
        break;
    }
    
    return Array.from(new Set(uses));
  }
  
  /**
   * Map service dependencies for a credential
   * 
   * @param classification Credential classification
   * @returns Array of service dependencies
   */
  private map_dependencies(classification: CredentialClassification): {
    service: ServiceType;
    dependency_type: 'direct' | 'indirect';
    confidence: number;
  }[] {
    const dependencies = [];
    
    // Add the primary service as a direct dependency
    dependencies.push({
      service: classification.service,
      dependency_type: 'direct',
      confidence: 0.95
    });
    
    // Add related services based on common patterns
    switch (classification.service) {
      case ServiceType.AWS:
        // AWS often involves dependent cloud services
        dependencies.push({
          service: ServiceType.GENERIC,
          dependency_type: 'indirect',
          confidence: 0.7
        });
        break;
        
      case ServiceType.GITHUB:
        // GitHub often connects to CI/CD services
        dependencies.push({
          service: ServiceType.GENERIC,
          dependency_type: 'indirect',
          confidence: 0.6
        });
        break;
    }
    
    return dependencies;
  }
  
  /**
   * Identify potential vulnerabilities for a credential
   * 
   * @param classification Credential classification
   * @returns Array of potential vulnerabilities
   */
  private identify_vulnerabilities(classification: CredentialClassification): {
    type: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    cve_id?: string;
  }[] {
    const vulnerabilities = [];
    
    // Common vulnerabilities based on credential type
    switch (classification.credentialType) {
      case CredentialType.AWS_ACCESS_KEY:
        vulnerabilities.push({
          type: 'excessive_permissions',
          description: 'AWS access keys often have excessive permissions',
          severity: 'high'
        });
        break;
        
      case CredentialType.DATABASE_CONNECTION_STRING:
        vulnerabilities.push({
          type: 'plaintext_credentials',
          description: 'Database credentials exposed in connection string',
          severity: 'critical'
        });
        break;
        
      case CredentialType.API_KEY:
        vulnerabilities.push({
          type: 'unlimited_usage',
          description: 'API key without usage limits',
          severity: 'medium'
        });
        break;
    }
    
    // Add general credential security vulnerabilities
    vulnerabilities.push({
      type: 'rotation_weakness',
      description: 'Long-lived credential without regular rotation',
      severity: 'medium'
    });
    
    return vulnerabilities;
  }
  
  /**
   * Suggest rotation strategy based on context
   * 
   * @param context Context graph
   * @returns Rotation recommendation
   */
  private suggest_rotation_strategy(context: ContextGraph): SecurityRecommendation | null {
    // Check if there are critical or high vulnerabilities
    const hasCriticalVulnerability = context.potential_vulnerabilities.some(
      v => v.severity === 'critical'
    );
    
    const hasHighVulnerability = context.potential_vulnerabilities.some(
      v => v.severity === 'high'
    );
    
    if (hasCriticalVulnerability) {
      return {
        type: 'rotation',
        priority: 'critical',
        description: 'Immediately rotate this credential due to critical vulnerability',
        action: 'Create new credential with proper scope and revoke existing credential',
        impact: 'major'
      };
    } else if (hasHighVulnerability) {
      return {
        type: 'rotation',
        priority: 'high',
        description: 'Rotate this credential due to high-risk vulnerabilities',
        action: 'Implement a scheduled rotation with minimal service disruption',
        impact: 'minor'
      };
    }
    
    return null;
  }
  
  /**
   * Optimize access scope based on context
   * 
   * @param context Context graph
   * @returns Access optimization recommendation
   */
  private optimize_access_scope(context: ContextGraph): SecurityRecommendation | null {
    // Check for AWS services
    const hasAwsDependency = context.service_dependencies.some(
      dep => dep.service === ServiceType.AWS
    );
    
    if (hasAwsDependency) {
      return {
        type: 'scope_reduction',
        priority: 'medium',
        description: 'Reduce AWS permissions to minimum required',
        action: 'Review IAM policies and apply least privilege principle',
        impact: 'minor'
      };
    }
    
    // Check for database services
    const hasDatabaseDependency = context.service_dependencies.some(
      dep => dep.service === ServiceType.DATABASE
    );
    
    if (hasDatabaseDependency) {
      return {
        type: 'scope_reduction',
        priority: 'high',
        description: 'Limit database user permissions to required operations only',
        action: 'Create database user with minimal required permissions',
        impact: 'minor'
      };
    }
    
    return null;
  }
  
  /**
   * Identify security upgrades based on context
   * 
   * @param context Context graph
   * @returns Array of security improvement recommendations
   */
  private identify_security_upgrades(context: ContextGraph): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];
    
    // Check for plaintext credential vulnerabilities
    const hasPlaintextVulnerability = context.potential_vulnerabilities.some(
      v => v.type === 'plaintext_credentials'
    );
    
    if (hasPlaintextVulnerability) {
      recommendations.push({
        type: 'secret_manager',
        priority: 'high',
        description: 'Use a secure secret manager instead of plaintext credentials',
        action: 'Migrate credentials to a secret management service',
        impact: 'minor'
      });
    }
    
    // General security recommendations
    recommendations.push({
      type: 'environment_variable',
      priority: 'medium',
      description: 'Use environment variables for credential storage',
      action: 'Move credentials to environment variables and reference them in code',
      impact: 'minor'
    });
    
    // Check for rotation vulnerabilities
    const hasRotationVulnerability = context.potential_vulnerabilities.some(
      v => v.type === 'rotation_weakness'
    );
    
    if (hasRotationVulnerability) {
      recommendations.push({
        type: 'policy_change',
        priority: 'medium',
        description: 'Implement an automated credential rotation schedule',
        action: 'Set up automation for regular credential rotation',
        impact: 'minor'
      });
    }
    
    return recommendations;
  }
}
