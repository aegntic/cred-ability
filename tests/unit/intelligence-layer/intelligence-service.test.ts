import { IntelligenceService } from '../../../src/intelligence-layer/intelligence-service';
import { CredentialContext } from '../../../src/intelligence-layer/context/types';
import { CredentialType, ServiceType, RiskLevel } from '../../../src/browser-integration/detection/types';
import { RecommendationStatus } from '../../../src/intelligence-layer/recommendations/types';

describe('IntelligenceService', () => {
  let intelligenceService: IntelligenceService;
  
  beforeEach(() => {
    intelligenceService = new IntelligenceService();
  });
  
  describe('processCredentialContext()', () => {
    it('should analyze context and generate recommendations', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        detectionUrl: 'https://github.com/user/repo/blob/main/config.js',
        detectionDomain: 'github.com',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      // Act
      const result = await intelligenceService.processCredentialContext(context);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.analysis.credentialId).toBe(context.credentialId);
      expect(result.analysis.serviceMappings.length).toBeGreaterThan(0);
      expect(result.analysis.usagePatterns.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
  
  describe('getAnalysis()', () => {
    it('should return previously analyzed context', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      
      // Act
      const analysis = intelligenceService.getAnalysis(context.credentialId);
      
      // Assert
      expect(analysis).toBeDefined();
      expect(analysis?.credentialId).toBe(context.credentialId);
    });
    
    it('should return null for unknown credential', () => {
      // Act
      const analysis = intelligenceService.getAnalysis('unknown-id');
      
      // Assert
      expect(analysis).toBeNull();
    });
  });
  
  describe('getRecommendations()', () => {
    it('should return recommendations for an analyzed credential', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        detectionUrl: 'https://github.com/user/repo/blob/main/config.js',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      
      // Act
      const recommendations = intelligenceService.getRecommendations(context.credentialId);
      
      // Assert
      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Should include rotation recommendation for high risk
      expect(recommendations.some(r => r.type === 'rotation')).toBeTruthy();
      
      // Should include scope reduction for AWS
      expect(recommendations.some(r => r.type === 'scope_reduction')).toBeTruthy();
      
      // Should include secret manager for GitHub detection
      expect(recommendations.some(r => r.type === 'secret_manager')).toBeTruthy();
    });
    
    it('should return empty array for unknown credential', () => {
      // Act
      const recommendations = intelligenceService.getRecommendations('unknown-id');
      
      // Assert
      expect(recommendations).toEqual([]);
    });
  });
  
  describe('updateRecommendationStatus()', () => {
    it('should update the status of a recommendation', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      const recommendations = intelligenceService.getRecommendations(context.credentialId);
      const recommendation = recommendations[0];
      
      // Act
      const updated = intelligenceService.updateRecommendationStatus(
        recommendation.id,
        RecommendationStatus.IMPLEMENTED
      );
      
      // Assert
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(recommendation.id);
      expect(updated?.status).toBe(RecommendationStatus.IMPLEMENTED);
      
      // Check that the status is persisted
      const afterUpdate = intelligenceService.getRecommendations(context.credentialId);
      const foundAfterUpdate = afterUpdate.find(r => r.id === recommendation.id);
      expect(foundAfterUpdate?.status).toBe(RecommendationStatus.IMPLEMENTED);
    });
    
    it('should return null for unknown recommendation', () => {
      // Act
      const result = intelligenceService.updateRecommendationStatus(
        'unknown-id',
        RecommendationStatus.IMPLEMENTED
      );
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('buildContextGraph()', () => {
    it('should build a context graph for an analyzed credential', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      
      // Act
      const graph = intelligenceService.buildContextGraph(context.credentialId);
      
      // Assert
      expect(graph).toBeDefined();
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.edges.length).toBeGreaterThan(0);
      
      // Should include credential node
      expect(graph.nodes.some(n => n.id === context.credentialId)).toBeTruthy();
      
      // Should include service node
      expect(graph.nodes.some(n => n.type === 'service' && n.label === ServiceType.AWS)).toBeTruthy();
      
      // Should include edges
      expect(graph.edges.some(e => e.source === context.credentialId)).toBeTruthy();
    });
    
    it('should return empty graph for unknown credential', () => {
      // Act
      const graph = intelligenceService.buildContextGraph('unknown-id');
      
      // Assert
      expect(graph).toBeDefined();
      expect(graph.nodes).toEqual([]);
      expect(graph.edges).toEqual([]);
    });
  });
  
  describe('createRotationPlan()', () => {
    it('should create a rotation plan for a high-risk credential', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      
      // Act
      const plan = intelligenceService.createRotationPlan(context.credentialId);
      
      // Assert
      expect(plan).toBeDefined();
      expect(plan?.credentialId).toBe(context.credentialId);
      expect(plan?.recommendedSchedule).toBeDefined();
      expect(plan?.rotationSteps.length).toBeGreaterThan(0);
      
      // For high risk, should recommend weekly or more frequent rotation
      expect(['daily', 'weekly']).toContain(plan?.recommendedSchedule.frequency);
      
      // Should have steps for AWS key rotation
      expect(plan?.rotationSteps.some(step => step.includes('IAM'))).toBeTruthy();
    });
    
    it('should return null for unknown credential', () => {
      // Act
      const plan = intelligenceService.createRotationPlan('unknown-id');
      
      // Assert
      expect(plan).toBeNull();
    });
  });
  
  describe('createAccessScopeRecommendation()', () => {
    it('should create an access scope recommendation for an AWS credential', async () => {
      // Arrange
      const context: CredentialContext = {
        credentialId: 'test-credential-id',
        credentialType: CredentialType.AWS_ACCESS_KEY,
        service: ServiceType.AWS,
        detectionSource: 'browser',
        confidence: 0.9,
        riskLevel: RiskLevel.HIGH,
        timestamp: new Date().toISOString()
      };
      
      await intelligenceService.processCredentialContext(context);
      
      // Act
      const recommendation = intelligenceService.createAccessScopeRecommendation(context.credentialId);
      
      // Assert
      expect(recommendation).toBeDefined();
      expect(recommendation?.credentialId).toBe(context.credentialId);
      expect(recommendation?.currentScope.length).toBeGreaterThan(0);
      expect(recommendation?.recommendedScope.length).toBeGreaterThan(0);
      expect(recommendation?.excessivePermissions.length).toBeGreaterThan(0);
      
      // Recommended scope should be a subset of current scope
      recommendation?.recommendedScope.forEach(perm => {
        expect(recommendation.currentScope.some(current => 
          current.includes(perm) || perm.includes(current)
        )).toBeTruthy();
      });
      
      // Excessive permissions should be in current but not in recommended
      recommendation?.excessivePermissions.forEach(perm => {
        expect(recommendation.currentScope.includes(perm)).toBeTruthy();
        expect(recommendation.recommendedScope.includes(perm)).toBeFalsy();
      });
    });
    
    it('should return null for unknown credential', () => {
      // Act
      const recommendation = intelligenceService.createAccessScopeRecommendation('unknown-id');
      
      // Assert
      expect(recommendation).toBeNull();
    });
  });
});
