import { 
  CredentialDetectionResult, 
  DetectedCredential, 
  CredentialType,
  CredentialClassification,
  ContextualMetadata,
  SecurityRecommendation,
  ServiceType,
  RiskLevel,
  RecommendationType,
  PriorityLevel,
  ImpactLevel
} from './types';
import { getDetectionPatterns } from './patterns';
import { logger, maskCredential } from '../../common/logger';

/**
 * CredentialDetector class for identifying credentials in content
 * 
 * Implements the detection, classification, contextualization, and recommendation
 * capabilities as specified in the SRS.
 */
export class CredentialDetector {
  private static instance: CredentialDetector;
  
  /**
   * Get the singleton instance of CredentialDetector
   */
  public static getInstance(): CredentialDetector {
    if (!CredentialDetector.instance) {
      CredentialDetector.instance = new CredentialDetector();
    }
    return CredentialDetector.instance;
  }
  
  /**
   * Detect credentials in the provided content
   * 
   * @param content The text content to analyze
   * @returns Detection result with credentials and confidence
   */
  public detect(content: string): CredentialDetectionResult {
    logger.debug('Detecting credentials in content', { contentLength: content.length });
    
    const patterns = getDetectionPatterns();
    const detectedCredentials: DetectedCredential[] = [];
    
    for (const patternDef of patterns) {
      const { pattern, type, service, confidenceBase, validator, metadataExtractor } = patternDef;
      
      // Find all matches for the current pattern
      const matches = this.findAllMatches(pattern, content);
      
      for (const match of matches) {
        const value = match.groups?.[1] || match[1] || match[0];
        
        // Skip if the validator rejects this match
        if (validator && !validator(value)) {
          continue;
        }
        
        // Calculate confidence score
        const confidence = this.calculateConfidence(
          confidenceBase,
          value,
          content
        );
        
        // Only include matches with sufficient confidence
        if (confidence < 0.5) {
          continue;
        }
        
        // Extract additional metadata if available
        const additionalMetadata = metadataExtractor 
          ? metadataExtractor(value, content) 
          : {};
        
        // Create the credential object
        const credential: DetectedCredential = {
          type,
          value,
          pattern: pattern,
          matchedString: match[0],
          confidence,
          metadata: {
            service: service || ServiceType.UNKNOWN,
            ...additionalMetadata
          }
        };
        
        logger.debug('Detected credential', { 
          type, 
          matchedPattern: pattern.toString(),
          confidence,
          value: maskCredential(value)
        });
        
        detectedCredentials.push(credential);
      }
    }
    
    // Calculate overall confidence of detection results
    const overallConfidence = this.calculateOverallConfidence(detectedCredentials);
    
    return {
      credentials: detectedCredentials,
      confidence: overallConfidence
    };
  }
  
  /**
   * Classify detected credentials
   * 
   * @param credentials Array of detected credentials
   * @returns Classification of the credentials
   */
  public classify(credentials: DetectedCredential[]): CredentialClassification[] {
    if (!credentials || credentials.length === 0) {
      return [];
    }
    
    return credentials.map(credential => {
      const { type, metadata, confidence } = credential;
      const service = metadata.service || ServiceType.UNKNOWN;
      
      // Determine risk level based on credential type and service
      const riskLevel = this.assessRiskLevel(type, service);
      
      // Potential uses based on credential type and service
      const potentialUses = this.determinePotentialUses(type, service);
      
      // Permissions assessment
      const permissions = this.assessPotentialPermissions(type, service);
      
      return {
        credentialType: type,
        service,
        confidenceScore: confidence,
        riskLevel,
        permissions,
        potentialUses
      };
    });
  }
  
  /**
   * Build contextual metadata for detected credentials
   * 
   * @param classifications Credential classifications
   * @param url Current URL
   * @param pageContext Additional page context
   * @returns Contextual metadata
   */
  public contextualize(
    classifications: CredentialClassification[],
    url?: string,
    pageContext?: Record<string, any>
  ): ContextualMetadata {
    const domain = url ? new URL(url).hostname : undefined;
    const path = url ? new URL(url).pathname : undefined;
    
    // Extract related services from classifications
    const relatedServices = Array.from(new Set(
      classifications.map(c => c.service)
    ));
    
    return {
      url,
      domain,
      path,
      pageTitle: pageContext?.title,
      formAction: pageContext?.formAction,
      inputName: pageContext?.inputName,
      applicationType: pageContext?.applicationType,
      timestamp: new Date().toISOString(),
      relatedServices,
      relatedCredentials: []
    };
  }
  
  /**
   * Generate security recommendations based on credential analysis
   * 
   * @param classifications Credential classifications
   * @param context Contextual metadata
   * @returns Array of security recommendations
   */
  public recommend(
    classifications: CredentialClassification[],
    context: ContextualMetadata
  ): SecurityRecommendation[] {
    const recommendations: SecurityRecommendation[] = [];
    
    // Process each classification for recommendations
    for (const classification of classifications) {
      const { credentialType, service, riskLevel } = classification;
      
      // Always recommend rotation for high-risk credentials
      if (riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL) {
        recommendations.push({
          type: RecommendationType.ROTATION,
          priority: riskLevel === RiskLevel.CRITICAL ? PriorityLevel.CRITICAL : PriorityLevel.HIGH,
          description: `${service} ${credentialType} should be rotated immediately due to high risk exposure`,
          action: 'Generate a new credential and revoke this one',
          impact: ImpactLevel.MINOR
        });
      }
      
      // Recommend secret managers instead of hardcoded credentials
      if (context.applicationType === 'code' || context.url?.includes('github.com')) {
        recommendations.push({
          type: RecommendationType.SECRET_MANAGER,
          priority: PriorityLevel.HIGH,
          description: 'Use a secure secret manager instead of hardcoding credentials',
          action: 'Move credentials to a secret management service',
          impact: ImpactLevel.MINOR
        });
      }
      
      // Service-specific recommendations
      switch (service) {
        case ServiceType.AWS:
          recommendations.push({
            type: RecommendationType.SCOPE_REDUCTION,
            priority: PriorityLevel.MEDIUM,
            description: 'Reduce AWS permissions to minimum required',
            action: 'Review IAM policies and apply least privilege principle',
            impact: ImpactLevel.MAJOR
          });
          break;
          
        case ServiceType.GITHUB:
          recommendations.push({
            type: RecommendationType.ALTERNATIVE_AUTH,
            priority: PriorityLevel.MEDIUM,
            description: 'Consider using GitHub Apps instead of personal access tokens',
            action: 'Create a GitHub App with specific permissions',
            impact: ImpactLevel.MAJOR
          });
          break;
          
        case ServiceType.DATABASE:
          recommendations.push({
            type: RecommendationType.POLICY_CHANGE,
            priority: PriorityLevel.HIGH,
            description: 'Database credentials should never be exposed',
            action: 'Use a connection proxy or secrets manager',
            impact: ImpactLevel.MAJOR
          });
          break;
      }
    }
    
    return recommendations;
  }
  
  /**
   * Find all matches for a specific pattern in content
   * 
   * @param pattern RegExp pattern to search for
   * @param content Text content to search in
   * @returns Array of RegExp matches
   */
  private findAllMatches(pattern: RegExp, content: string): RegExpExecArray[] {
    const matches: RegExpExecArray[] = [];
    const patternWithGlobal = new RegExp(pattern.source, 'g' + pattern.flags.replace('g', ''));
    
    let match;
    while ((match = patternWithGlobal.exec(content)) !== null) {
      matches.push(match);
    }
    
    return matches;
  }
  
  /**
   * Calculate confidence score for a detected credential
   * 
   * Factors that influence confidence:
   * - Base confidence of the pattern
   * - Entropy of the credential value
   * - Context signals (nearby service names, URL, etc.)
   * - Presence of validation factors
   * 
   * @param baseConfidence Base confidence from pattern definition
   * @param value The credential value
   * @param context Surrounding content
   * @returns Confidence score between 0 and 1
   */
  private calculateConfidence(
    baseConfidence: number,
    value: string,
    context: string
  ): number {
    let confidence = baseConfidence;
    
    // Adjust based on entropy (randomness) of the value
    const entropy = this.calculateEntropy(value);
    if (entropy > 3.5) {
      confidence += 0.1;
    } else if (entropy < 2.0) {
      confidence -= 0.2;
    }
    
    // Adjust based on value length
    if (value.length > 30) {
      confidence += 0.05;
    } else if (value.length < 10) {
      confidence -= 0.1;
    }
    
    // Penalize values that look like testing/dummy credentials
    if (/test|example|sample|dummy|password123/i.test(value)) {
      confidence -= 0.3;
    }
    
    // Cap confidence between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }
  
  /**
   * Calculate entropy (randomness) of a string
   * 
   * Higher entropy suggests a more random, likely credential string
   * 
   * @param str String to analyze
   * @returns Entropy value
   */
  private calculateEntropy(str: string): number {
    const len = str.length;
    
    // Count character frequencies
    const charFreq: Record<string, number> = {};
    for (let i = 0; i < len; i++) {
      const char = str[i];
      charFreq[char] = (charFreq[char] || 0) + 1;
    }
    
    // Calculate entropy using Shannon's formula
    let entropy = 0;
    for (const char in charFreq) {
      const freq = charFreq[char] / len;
      entropy -= freq * Math.log2(freq);
    }
    
    return entropy;
  }
  
  /**
   * Calculate overall confidence based on all detections
   * 
   * @param credentials Array of detected credentials
   * @returns Overall confidence score
   */
  private calculateOverallConfidence(credentials: DetectedCredential[]): number {
    if (credentials.length === 0) {
      return 0;
    }
    
    // Use the highest confidence as a starting point
    const maxConfidence = Math.max(...credentials.map(c => c.confidence));
    
    // Increase confidence if multiple credentials were detected
    let overallConfidence = maxConfidence;
    if (credentials.length > 1) {
      overallConfidence += 0.05 * Math.min(5, credentials.length - 1);
    }
    
    return Math.min(1, overallConfidence);
  }
  
  /**
   * Assess the risk level of a credential
   * 
   * @param type Credential type
   * @param service Service type
   * @returns Risk level assessment
   */
  private assessRiskLevel(type: CredentialType, service: ServiceType): RiskLevel {
    // Critical risk for certain combinations
    if (
      (service === ServiceType.AWS && type === CredentialType.AWS_ACCESS_KEY) ||
      (service === ServiceType.DATABASE && type === CredentialType.DATABASE_CONNECTION_STRING) ||
      type === CredentialType.SSH_KEY
    ) {
      return RiskLevel.CRITICAL;
    }
    
    // High risk for most API keys and tokens
    if (
      type === CredentialType.API_KEY ||
      type === CredentialType.PERSONAL_ACCESS_TOKEN ||
      service === ServiceType.STRIPE
    ) {
      return RiskLevel.HIGH;
    }
    
    // Medium risk for OAuth tokens
    if (type === CredentialType.OAUTH_TOKEN) {
      return RiskLevel.MEDIUM;
    }
    
    // Default risk level
    return RiskLevel.UNKNOWN;
  }
  
  /**
   * Determine potential uses for a credential
   * 
   * @param type Credential type
   * @param service Service type
   * @returns Array of potential use cases
   */
  private determinePotentialUses(type: CredentialType, service: ServiceType): string[] {
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
   * Assess potential permissions associated with a credential
   * 
   * @param type Credential type
   * @param service Service type
   * @returns Array of potential permissions
   */
  private assessPotentialPermissions(type: CredentialType, service: ServiceType): string[] {
    const permissions: string[] = [];
    
    // Service-specific permissions
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
    }
    
    return permissions;
  }
}
