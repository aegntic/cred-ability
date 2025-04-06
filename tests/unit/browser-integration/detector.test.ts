import { CredentialDetector } from '../../../src/browser-integration/detection/detector';
import { CredentialType, ServiceType, RiskLevel } from '../../../src/browser-integration/detection/types';

describe('CredentialDetector', () => {
  let detector: CredentialDetector;
  
  beforeEach(() => {
    detector = new CredentialDetector();
  });
  
  describe('detect()', () => {
    it('should detect API keys with high confidence', () => {
      // Arrange
      const content = 'const apiKey = "abc123def456ghi789jkl012mno345pqrs"';
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      expect(result.credentials).toHaveLength(1);
      expect(result.credentials[0].type).toBe(CredentialType.API_KEY);
      expect(result.credentials[0].confidence).toBeGreaterThan(0.7);
      expect(result.confidence).toBeGreaterThan(0.7);
    });
    
    it('should detect AWS access keys', () => {
      // Arrange
      const content = 'AKIAIOSFODNN7EXAMPLE';
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      expect(result.credentials).toHaveLength(1);
      expect(result.credentials[0].type).toBe(CredentialType.AWS_ACCESS_KEY);
      expect(result.credentials[0].metadata.service).toBe(ServiceType.AWS);
      expect(result.credentials[0].confidence).toBeGreaterThan(0.8);
    });
    
    it('should detect GitHub tokens', () => {
      // Arrange
      const content = 'github_token="ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789"';
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      expect(result.credentials).toHaveLength(1);
      expect(result.credentials[0].type).toBe(CredentialType.PERSONAL_ACCESS_TOKEN);
      expect(result.credentials[0].metadata.service).toBe(ServiceType.GITHUB);
    });
    
    it('should detect database connection strings', () => {
      // Arrange
      const content = 'mongodb://username:password@mongodb0.example.com:27017/admin';
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      expect(result.credentials).toHaveLength(1);
      expect(result.credentials[0].type).toBe(CredentialType.DATABASE_CONNECTION_STRING);
      expect(result.credentials[0].metadata.service).toBe(ServiceType.DATABASE);
      expect(result.credentials[0].metadata.databaseType).toBe('mongodb');
    });
    
    it('should detect multiple credentials in the same content', () => {
      // Arrange
      const content = `
        const apiKey = "abc123def456ghi789jkl012mno345pqrs";
        const githubToken = "ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789";
        const mongoUri = "mongodb://username:password@mongodb0.example.com:27017/admin";
      `;
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      expect(result.credentials.length).toBeGreaterThanOrEqual(2);
      // Overall confidence should be higher with multiple detections
      expect(result.confidence).toBeGreaterThan(0.8);
    });
    
    it('should ignore obvious test/dummy credentials', () => {
      // Arrange
      const content = 'api_key="test1234" access_token="example_token_123"';
      
      // Act
      const result = detector.detect(content);
      
      // Assert
      // Should either not detect these or have very low confidence
      expect(result.credentials.every(c => c.confidence < 0.5)).toBeTruthy();
    });
  });
  
  describe('classify()', () => {
    it('should classify AWS credentials with high risk', () => {
      // Arrange
      const content = 'AKIAIOSFODNN7EXAMPLE';
      const detectionResult = detector.detect(content);
      
      // Act
      const classifications = detector.classify(detectionResult.credentials);
      
      // Assert
      expect(classifications).toHaveLength(1);
      expect(classifications[0].credentialType).toBe(CredentialType.AWS_ACCESS_KEY);
      expect(classifications[0].service).toBe(ServiceType.AWS);
      expect(classifications[0].riskLevel).toBe(RiskLevel.CRITICAL);
      expect(classifications[0].permissions).toContain('AWS:*');
    });
    
    it('should classify database credentials as critical risk', () => {
      // Arrange
      const content = 'mongodb://username:password@mongodb0.example.com:27017/admin';
      const detectionResult = detector.detect(content);
      
      // Act
      const classifications = detector.classify(detectionResult.credentials);
      
      // Assert
      expect(classifications).toHaveLength(1);
      expect(classifications[0].credentialType).toBe(CredentialType.DATABASE_CONNECTION_STRING);
      expect(classifications[0].service).toBe(ServiceType.DATABASE);
      expect(classifications[0].riskLevel).toBe(RiskLevel.CRITICAL);
      expect(classifications[0].permissions).toContain('READ');
      expect(classifications[0].permissions).toContain('WRITE');
    });
    
    it('should identify potential uses for GitHub tokens', () => {
      // Arrange
      const content = 'github_token="ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789"';
      const detectionResult = detector.detect(content);
      
      // Act
      const classifications = detector.classify(detectionResult.credentials);
      
      // Assert
      expect(classifications).toHaveLength(1);
      expect(classifications[0].service).toBe(ServiceType.GITHUB);
      expect(classifications[0].potentialUses).toContain('Repository Access');
      expect(classifications[0].potentialUses).toContain('Source Code Access');
    });
  });
  
  describe('contextualize()', () => {
    it('should extract domain and path from URL', () => {
      // Arrange
      const content = 'apiKey="abc123def456ghi789jkl012mno345pqrs"';
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      const url = 'https://api.example.com/dashboard/settings';
      
      // Act
      const context = detector.contextualize(classifications, url);
      
      // Assert
      expect(context.domain).toBe('api.example.com');
      expect(context.path).toBe('/dashboard/settings');
      expect(context.timestamp).toBeDefined();
    });
    
    it('should include page context when provided', () => {
      // Arrange
      const content = 'apiKey="abc123def456ghi789jkl012mno345pqrs"';
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      const url = 'https://api.example.com/dashboard';
      const pageContext = {
        title: 'API Settings',
        formAction: '/api/settings/update',
        applicationType: 'web'
      };
      
      // Act
      const context = detector.contextualize(classifications, url, pageContext);
      
      // Assert
      expect(context.pageTitle).toBe('API Settings');
      expect(context.formAction).toBe('/api/settings/update');
      expect(context.applicationType).toBe('web');
    });
    
    it('should collect related services from multiple credentials', () => {
      // Arrange
      const content = `
        const apiKey = "abc123def456ghi789jkl012mno345pqrs";
        const awsKey = "AKIAIOSFODNN7EXAMPLE";
      `;
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      
      // Act
      const context = detector.contextualize(classifications);
      
      // Assert
      expect(context.relatedServices).toContain(ServiceType.AWS);
      expect(context.relatedServices.length).toBeGreaterThanOrEqual(1);
    });
  });
  
  describe('recommend()', () => {
    it('should recommend rotation for high-risk credentials', () => {
      // Arrange
      const content = 'AKIAIOSFODNN7EXAMPLE';
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      const context = detector.contextualize(classifications);
      
      // Act
      const recommendations = detector.recommend(classifications, context);
      
      // Assert
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(r => r.type === 'rotation')).toBeTruthy();
      expect(recommendations.some(r => r.priority === 'critical' || r.priority === 'high')).toBeTruthy();
    });
    
    it('should recommend secret manager for credentials in code context', () => {
      // Arrange
      const content = 'apiKey="abc123def456ghi789jkl012mno345pqrs"';
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      const context = detector.contextualize(
        classifications,
        'https://github.com/user/repo/blob/main/config.js'
      );
      context.applicationType = 'code';
      
      // Act
      const recommendations = detector.recommend(classifications, context);
      
      // Assert
      expect(recommendations.some(r => r.type === 'secret_manager')).toBeTruthy();
    });
    
    it('should recommend service-specific actions', () => {
      // Arrange
      const content = 'AKIAIOSFODNN7EXAMPLE';
      const detectionResult = detector.detect(content);
      const classifications = detector.classify(detectionResult.credentials);
      const context = detector.contextualize(classifications);
      
      // Act
      const recommendations = detector.recommend(classifications, context);
      
      // Assert
      // For AWS, should recommend scope reduction
      expect(recommendations.some(r => r.type === 'scope_reduction')).toBeTruthy();
    });
  });
});
