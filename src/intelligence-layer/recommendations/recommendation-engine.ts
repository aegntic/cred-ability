import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../common/logger';
import { ContextualAnalysis } from '../context/types';
import {
  SecurityRecommendation,
  RecommendationType,
  PriorityLevel,
  ImpactLevel,
  RecommendationStatus,
  RotationPlan,
  AccessScopeRecommendation,
  SecurityImprovement
} from './types';
import { ServiceType } from '../../browser-integration/detection/types';

/**
 * Engine for generating security recommendations based on credential context
 */
export class RecommendationEngine {
  // In-memory store of recommendations for demo purposes
  private recommendations: Map<string, SecurityRecommendation[]>;
  
  constructor() {
    this.recommendations = new Map<string, SecurityRecommendation[]>();
    logger.info('Recommendation engine initialized');
  }
  
  /**
   * Generate recommendations based on contextual analysis
   * 
   * @param analysis Contextual analysis of a credential
   * @returns Array of security recommendations
   */
  public generateRecommendations(analysis: ContextualAnalysis): SecurityRecommendation[] {
    logger.info('Generating recommendations', {
      credentialId: analysis.credentialId
    });
    
    const recommendations: SecurityRecommendation[] = [];
    
    // Generate rotation recommendations
    const rotationRec = this.generateRotationRecommendation(analysis);
    if (rotationRec) {
      recommendations.push(rotationRec);
    }
    
    // Generate scope reduction recommendations
    const scopeRec = this.generateScopeRecommendation(analysis);
    if (scopeRec) {
      recommendations.push(scopeRec);
    }
    
    // Generate security improvement recommendations
    const securityRecs = this.generateSecurityImprovements(analysis);
    recommendations.push(...securityRecs);
    
    // Store the recommendations
    this.recommendations.set(analysis.credentialId, recommendations);
    
    return recommendations;
  }
  
  /**
   * Get recommendations for a credential
   * 
   * @param credentialId ID of the credential
   * @returns Array of recommendations or empty array if none found
   */
  public getRecommendations(credentialId: string): SecurityRecommendation[] {
    return this.recommendations.get(credentialId) || [];
  }
  
  /**
   * Update the status of a recommendation
   * 
   * @param recommendationId ID of the recommendation
   * @param status New status
   * @returns Updated recommendation or null if not found
   */
  public updateRecommendationStatus(
    recommendationId: string,
    status: RecommendationStatus
  ): SecurityRecommendation | null {
    // Search all recommendation lists
    for (const [credentialId, recs] of this.recommendations.entries()) {
      const index = recs.findIndex(r => r.id === recommendationId);
      
      if (index !== -1) {
        // Update the status
        recs[index].status = status;
        
        // Update the stored list
        this.recommendations.set(credentialId, recs);
        
        return recs[index];
      }
    }
    
    return null;
  }
  
  /**
   * Generate a rotation recommendation
   * 
   * @param analysis Contextual analysis
   * @returns Rotation recommendation or null if not needed
   */
  private generateRotationRecommendation(analysis: ContextualAnalysis): SecurityRecommendation | null {
    // Determine if rotation is needed based on risk assessment
    if (analysis.riskAssessment.overallScore >= 0.7) {
      // High risk, recommend immediate rotation
      return {
        id: uuidv4(),
        credentialId: analysis.credentialId,
        type: RecommendationType.ROTATION,
        priority: analysis.riskAssessment.overallScore >= 0.9 ? PriorityLevel.CRITICAL : PriorityLevel.HIGH,
        description: `This credential has a high risk score (${analysis.riskAssessment.overallScore.toFixed(2)}) and should be rotated immediately.`,
        action: 'Generate a new credential and revoke the existing one.',
        impact: ImpactLevel.MINOR,
        benefits: [
          'Mitigates potential credential compromise',
          'Enforces good security hygiene',
          'Reduces exposure window'
        ],
        implementation: this.getRotationImplementation(analysis),
        createdAt: new Date().toISOString(),
        status: RecommendationStatus.PENDING
      };
    } else if (analysis.riskAssessment.overallScore >= 0.4) {
      // Medium risk, recommend scheduled rotation
      return {
        id: uuidv4(),
        credentialId: analysis.credentialId,
        type: RecommendationType.ROTATION,
        priority: PriorityLevel.MEDIUM,
        description: `This credential should be included in a regular rotation schedule.`,
        action: 'Set up automated credential rotation on a quarterly basis.',
        impact: ImpactLevel.MINOR,
        benefits: [
          'Establishes good security practices',
          'Reduces credential lifetime',
          'Minimizes impact of undetected breaches'
        ],
        implementation: this.getRotationImplementation(analysis),
        createdAt: new Date().toISOString(),
        status: RecommendationStatus.PENDING
      };
    }
    
    return null;
  }
  
  /**
   * Generate scope reduction recommendation
   * 
   * @param analysis Contextual analysis
   * @returns Scope reduction recommendation or null if not needed
   */
  private generateScopeRecommendation(analysis: ContextualAnalysis): SecurityRecommendation | null {
    // Find the primary service
    const primaryService = analysis.serviceMappings.find(m => m.confidence > 0.8);
    
    if (!primaryService) {
      return null;
    }
    
    // Recommendations based on service
    switch (primaryService.service) {
      case ServiceType.AWS:
        return {
          id: uuidv4(),
          credentialId: analysis.credentialId,
          type: RecommendationType.SCOPE_REDUCTION,
          priority: PriorityLevel.HIGH,
          description: 'AWS credentials often have excessive permissions beyond what is needed.',
          action: 'Create an IAM policy with least privilege for this use case.',
          impact: ImpactLevel.MINOR,
          benefits: [
            'Reduces potential blast radius if compromised',
            'Follows AWS best practices',
            'Improves security posture'
          ],
          implementation: `
1. Analyze the usage patterns to determine necessary permissions
2. Create a custom IAM policy with only required permissions
3. Attach the policy to the user/role
4. Test functionality to ensure everything works
5. Remove any broader policies
          `,
          createdAt: new Date().toISOString(),
          status: RecommendationStatus.PENDING
        };
        
      case ServiceType.GITHUB:
        return {
          id: uuidv4(),
          credentialId: analysis.credentialId,
          type: RecommendationType.SCOPE_REDUCTION,
          priority: PriorityLevel.MEDIUM,
          description: 'This GitHub token may have more scopes than necessary.',
          action: 'Create a new token with minimal required scopes.',
          impact: ImpactLevel.MINOR,
          benefits: [
            'Limits token capabilities if compromised',
            'Improves security posture',
            'Provides better audit trail'
          ],
          implementation: `
1. Identify the specific GitHub scopes needed
2. Create a new token with only those scopes
3. Update references to use the new token
4. Revoke the old token
          `,
          createdAt: new Date().toISOString(),
          status: RecommendationStatus.PENDING
        };
        
      case ServiceType.DATABASE:
        return {
          id: uuidv4(),
          credentialId: analysis.credentialId,
          type: RecommendationType.SCOPE_REDUCTION,
          priority: PriorityLevel.HIGH,
          description: 'Database credentials often have full access when read-only might be sufficient.',
          action: 'Create a database user with minimal required permissions.',
          impact: ImpactLevel.MINOR,
          benefits: [
            'Prevents unintended data modifications',
            'Reduces risk of data loss if compromised',
            'Follows database security best practices'
          ],
          implementation: `
1. Identify the specific database operations needed
2. Create a new database user with limited permissions
3. Update connection strings to use the new user
4. Revoke permissions from the old user
          `,
          createdAt: new Date().toISOString(),
          status: RecommendationStatus.PENDING
        };
    }
    
    return null;
  }
  
  /**
   * Generate general security improvement recommendations
   * 
   * @param analysis Contextual analysis
   * @returns Array of security improvement recommendations
   */
  private generateSecurityImprovements(analysis: ContextualAnalysis): SecurityRecommendation[] {
    const improvements: SecurityRecommendation[] = [];
    
    // Recommend secret manager if credential is found in code
    const usedInCode = analysis.usagePatterns.some(p => 
      p.contexts.includes('code') || p.application.includes('git')
    );
    
    if (usedInCode) {
      improvements.push({
        id: uuidv4(),
        credentialId: analysis.credentialId,
        type: RecommendationType.SECRET_MANAGER,
        priority: PriorityLevel.HIGH,
        description: 'Credentials should not be hardcoded in source code.',
        action: 'Move credentials to a secret management service.',
        impact: ImpactLevel.MAJOR,
        benefits: [
          'Prevents credentials from being committed to repositories',
          'Provides secure, audited access to secrets',
          'Enables automated rotation',
          'Centralizes credential management'
        ],
        implementation: `
1. Set up a secret manager (AWS Secrets Manager, HashiCorp Vault, etc.)
2. Store the credential in the secret manager
3. Update application code to retrieve the secret at runtime
4. Remove hardcoded credentials from the codebase
        `,
        createdAt: new Date().toISOString(),
        status: RecommendationStatus.PENDING
      });
    }
    
    // Recommend using environment variables
    improvements.push({
      id: uuidv4(),
      credentialId: analysis.credentialId,
      type: RecommendationType.ENVIRONMENT_VARIABLE,
      priority: PriorityLevel.MEDIUM,
      description: 'Use environment variables for credential storage instead of hardcoding.',
      action: 'Move credentials to environment variables.',
      impact: ImpactLevel.MINOR,
      benefits: [
        'Separates credentials from code',
        'Makes deployment more flexible',
        'Follows security best practices'
      ],
      implementation: `
1. Identify where the credential is currently stored
2. Set up environment variables in your hosting environment
3. Update application code to read from environment variables
4. Remove hardcoded credentials
      `,
      createdAt: new Date().toISOString(),
      status: RecommendationStatus.PENDING
    });
    
    // Service-specific recommendations
    const primaryService = analysis.serviceMappings.find(m => m.confidence > 0.8);
    
    if (primaryService && primaryService.service === ServiceType.AWS) {
      // Recommend AWS-specific security improvements
      improvements.push({
        id: uuidv4(),
        credentialId: analysis.credentialId,
        type: RecommendationType.ALTERNATIVE_AUTH,
        priority: PriorityLevel.MEDIUM,
        description: 'Consider using IAM roles instead of access keys for AWS services.',
        action: 'Migrate from access keys to IAM roles where possible.',
        impact: ImpactLevel.MAJOR,
        benefits: [
          'Eliminates need to manage long-lived credentials',
          'Provides automatic credential rotation',
          'Follows AWS best practices'
        ],
        implementation: `
1. Identify the services using this access key
2. For EC2: Create and attach appropriate IAM roles
3. For Lambda: Configure execution roles
4. For other services: Use service roles where supported
5. Remove hardcoded access keys
        `,
        createdAt: new Date().toISOString(),
        status: RecommendationStatus.PENDING
      });
    }
    
    return improvements;
  }
  
  /**
   * Get rotation implementation steps based on service
   * 
   * @param analysis Contextual analysis
   * @returns Rotation implementation instructions
   */
  private getRotationImplementation(analysis: ContextualAnalysis): string {
    // Find the primary service
    const primaryService = analysis.serviceMappings.find(m => m.confidence > 0.8);
    
    if (!primaryService) {
      return `
1. Generate a new credential
2. Update all references to use the new credential
3. Revoke the old credential after confirming everything works
      `;
    }
    
    // Service-specific rotation instructions
    switch (primaryService.service) {
      case ServiceType.AWS:
        return `
1. Create a new IAM access key for the user
2. Update applications to use the new key
3. Monitor for usage of the old key
4. Deactivate the old key after confirming no usage
5. Delete the old key after a safety period
        `;
        
      case ServiceType.GITHUB:
        return `
1. Create a new GitHub personal access token with the same scopes
2. Update any systems or scripts using the token
3. Verify functionality with the new token
4. Revoke the old token in GitHub settings
        `;
        
      case ServiceType.DATABASE:
        return `
1. Update the database user's password
2. Update connection strings in applications
3. Test connections with the new password
4. If possible, revoke sessions using the old password
        `;
        
      default:
        return `
1. Generate a new credential
2. Update all references to use the new credential
3. Revoke the old credential after confirming everything works
        `;
    }
  }
  
  /**
   * Create a detailed rotation plan
   * 
   * @param credentialId Credential ID
   * @returns Rotation plan
   */
  public createRotationPlan(credentialId: string): RotationPlan | null {
    const recommendations = this.recommendations.get(credentialId);
    
    if (!recommendations) {
      return null;
    }
    
    // Find rotation recommendation
    const rotationRec = recommendations.find(r => r.type === RecommendationType.ROTATION);
    
    if (!rotationRec) {
      return null;
    }
    
    // Determine rotation frequency based on priority
    let frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    
    switch (rotationRec.priority) {
      case PriorityLevel.CRITICAL:
        frequency = 'daily';
        break;
      case PriorityLevel.HIGH:
        frequency = 'weekly';
        break;
      case PriorityLevel.MEDIUM:
        frequency = 'monthly';
        break;
      default:
        frequency = 'quarterly';
    }
    
    // Calculate next rotation date
    const nextRotation = new Date();
    switch (frequency) {
      case 'daily':
        nextRotation.setDate(nextRotation.getDate() + 1);
        break;
      case 'weekly':
        nextRotation.setDate(nextRotation.getDate() + 7);
        break;
      case 'monthly':
        nextRotation.setMonth(nextRotation.getMonth() + 1);
        break;
      case 'quarterly':
        nextRotation.setMonth(nextRotation.getMonth() + 3);
        break;
    }
    
    // Extract rotation steps from implementation
    const rotationSteps = rotationRec.implementation
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0);
    
    return {
      credentialId,
      recommendedSchedule: {
        frequency,
        nextRotation: nextRotation.toISOString()
      },
      rotationSteps,
      potentialImpact: this.getImpactDescription(rotationRec.impact)
    };
  }
  
  /**
   * Create a detailed access scope recommendation
   * 
   * @param credentialId Credential ID
   * @returns Access scope recommendation
   */
  public createAccessScopeRecommendation(credentialId: string): AccessScopeRecommendation | null {
    const recommendations = this.recommendations.get(credentialId);
    
    if (!recommendations) {
      return null;
    }
    
    // Find scope reduction recommendation
    const scopeRec = recommendations.find(r => r.type === RecommendationType.SCOPE_REDUCTION);
    
    if (!scopeRec) {
      return null;
    }
    
    // Example implementation - in a real system, this would be based on
    // actual credential analysis and usage patterns
    return {
      credentialId,
      currentScope: [
        'iam:*',
        's3:*',
        'ec2:*',
        'lambda:*',
        'cloudwatch:*'
      ],
      recommendedScope: [
        's3:GetObject',
        's3:PutObject',
        'cloudwatch:PutMetricData'
      ],
      excessivePermissions: [
        'iam:*',
        'ec2:*',
        'lambda:*',
        's3:DeleteObject',
        's3:ListBucket'
      ],
      justification: 'Based on usage analysis, this credential only needs to read and write S3 objects and publish CloudWatch metrics.'
    };
  }
  
  /**
   * Get a description for an impact level
   * 
   * @param impact Impact level
   * @returns Description
   */
  private getImpactDescription(impact: ImpactLevel): string {
    switch (impact) {
      case ImpactLevel.BREAKING:
        return 'Will cause disruption requiring coordination and planned downtime';
      case ImpactLevel.MAJOR:
        return 'Significant changes required but can be done with minimal downtime';
      case ImpactLevel.MINOR:
        return 'Small changes with negligible impact on systems';
      case ImpactLevel.NONE:
        return 'No impact on existing systems';
      default:
        return 'Unknown impact';
    }
  }
}
