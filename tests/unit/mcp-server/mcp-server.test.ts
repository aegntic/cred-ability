import { MCPServer } from '../../../src/mcp-server/processor/mcp-server';
import { 
  CredentialEvent, 
  EventSource, 
  CredentialType,
  ServiceType,
  RiskLevel
} from '../../../src/mcp-server/processor/types';

describe('MCPServer', () => {
  let mcpServer: MCPServer;
  
  beforeEach(() => {
    mcpServer = new MCPServer();
  });
  
  describe('process_credential_event()', () => {
    it('should process credential events end-to-end', async () => {
      // Arrange
      const event: CredentialEvent = {
        id: 'test-event-id',
        source: EventSource.BROWSER,
        credential: {
          type: CredentialType.API_KEY,
          value: 'test-api-key-value'
        },
        context: {
          url: 'https://example.com/dashboard',
          domain: 'example.com',
          timestamp: new Date().toISOString(),
          application: 'web-app'
        },
        confidence: 0.85
      };
      
      // Act
      const result = await mcpServer.process_credential_event(event);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.detection).toBeDefined();
      expect(result.classification).toBeDefined();
      expect(result.context).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.audit_log).toBeDefined();
      
      // Verify detection
      expect(result.detection.id).toBe(event.id);
      expect(result.detection.type).toBe(event.credential.type);
      expect(result.detection.confidence_score).toBe(event.confidence);
      
      // Verify classification
      expect(result.classification.credentialType).toBe(event.credential.type);
      expect(result.classification.confidenceScore).toBe(event.confidence);
      
      // Verify audit log
      expect(result.audit_log.action).toBe('credential_detection');
      expect(result.audit_log.result).toBe('success');
    });
  });
  
  describe('detect_credential()', () => {
    it('should detect AWS credentials with critical risk', () => {
      // Arrange
      const event: CredentialEvent = {
        id: 'test-aws-event',
        source: EventSource.BROWSER,
        credential: {
          type: CredentialType.AWS_ACCESS_KEY,
          value: 'AKIAIOSFODNN7EXAMPLE'
        },
        context: {
          url: 'https://github.com/user/repo/blob/main/config.js',
          domain: 'github.com',
          timestamp: new Date().toISOString()
        },
        confidence: 0.9
      };
      
      // Act
      const result = mcpServer.detect_credential(event);
      
      // Assert
      expect(result.type).toBe(CredentialType.AWS_ACCESS_KEY);
      expect(result.risk_profile.level).toBe(RiskLevel.CRITICAL);
      // Should have at least exposure context and credential type risk factors
      expect(result.risk_profile.factors.length).toBeGreaterThanOrEqual(2);
    });
    
    it('should detect lower risk for local development credentials', () => {
      // Arrange
      const event: CredentialEvent = {
        id: 'test-local-event',
        source: EventSource.BROWSER,
        credential: {
          type: CredentialType.API_KEY,
          value: 'test-api-key-value'
        },
        context: {
          url: 'http://localhost:3000/settings',
          domain: 'localhost',
          timestamp: new Date().toISOString()
        },
        confidence: 0.7
      };
      
      // Act
      const result = mcpServer.detect_credential(event);
      
      // Assert
      expect(result.type).toBe(CredentialType.API_KEY);
      // Should not be critical for localhost
      expect(result.risk_profile.level).not.toBe(RiskLevel.CRITICAL);
    });
  });
  
  describe('classify_credential()', () => {
    it('should correctly classify AWS credentials', () => {
      // Arrange
      const detection = {
        id: 'test-detection',
        type: CredentialType.AWS_ACCESS_KEY,
        confidence_score: 0.9,
        risk_profile: {
          level: RiskLevel.CRITICAL,
          factors: [{
            factor: 'test-factor',
            score: 0.9,
            details: 'test details'
          }]
        }
      };
      
      // Act
      const result = mcpServer.classify_credential(detection);
      
      // Assert
      expect(result.credentialType).toBe(CredentialType.AWS_ACCESS_KEY);
      expect(result.service).toBe(ServiceType.AWS);
      expect(result.permissions).toContain('AWS:*');
      expect(result.permissions).toContain('IAM:*');
      expect(result.potentialUses).toContain('AWS Service Access');
    });
    
    it('should classify database connection strings', () => {
      // Arrange
      const detection = {
        id: 'test-detection',
        type: CredentialType.DATABASE_CONNECTION_STRING,
        confidence_score: 0.85,
        risk_profile: {
          level: RiskLevel.HIGH,
          factors: [{
            factor: 'test-factor',
            score: 0.85,
            details: 'test details'
          }]
        }
      };
      
      // Act
      const result = mcpServer.classify_credential(detection);
      
      // Assert
      expect(result.credentialType).toBe(CredentialType.DATABASE_CONNECTION_STRING);
      expect(result.service).toBe(ServiceType.DATABASE);
      expect(result.permissions).toContain('READ');
      expect(result.permissions).toContain('WRITE');
      expect(result.potentialUses).toContain('Database Access');
    });
  });
  
  describe('build_context_graph()', () => {
    it('should identify service dependencies', () => {
      // Arrange
      const classification = {
        credentialType: CredentialType.API_KEY,
        service: ServiceType.AWS,
        confidenceScore: 0.9,
        riskLevel: RiskLevel.HIGH,
        permissions: ['AWS:*'],
        potentialUses: ['Cloud Management']
      };
      
      // Act
      const result = mcpServer.build_context_graph(classification);
      
      // Assert
      expect(result.service_dependencies.length).toBeGreaterThan(0);
      expect(result.service_dependencies[0].service).toBe(ServiceType.AWS);
      expect(result.service_dependencies[0].dependency_type).toBe('direct');
    });
    
    it('should identify potential vulnerabilities', () => {
      // Arrange
      const classification = {
        credentialType: CredentialType.DATABASE_CONNECTION_STRING,
        service: ServiceType.DATABASE,
        confidenceScore: 0.9,
        riskLevel: RiskLevel.CRITICAL,
        permissions: ['READ', 'WRITE'],
        potentialUses: ['Database Access']
      };
      
      // Act
      const result = mcpServer.build_context_graph(classification);
      
      // Assert
      expect(result.potential_vulnerabilities.length).toBeGreaterThan(0);
      // Should find the plaintext credentials vulnerability
      expect(result.potential_vulnerabilities.some(v => 
        v.type === 'plaintext_credentials' && v.severity === 'critical'
      )).toBeTruthy();
    });
  });
  
  describe('generate_recommendations()', () => {
    it('should recommend rotation for critical vulnerabilities', () => {
      // Arrange
      const context = {
        service_dependencies: [{
          service: ServiceType.AWS,
          dependency_type: 'direct',
          confidence: 0.95
        }],
        potential_vulnerabilities: [{
          type: 'plaintext_credentials',
          description: 'Credential exposed in plaintext',
          severity: 'critical'
        }]
      };
      
      // Act
      const result = mcpServer.generate_recommendations(context);
      
      // Assert
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(r => r.type === 'rotation' && r.priority === 'critical')).toBeTruthy();
    });
    
    it('should recommend scope reduction for AWS credentials', () => {
      // Arrange
      const context = {
        service_dependencies: [{
          service: ServiceType.AWS,
          dependency_type: 'direct',
          confidence: 0.95
        }],
        potential_vulnerabilities: [{
          type: 'excessive_permissions',
          description: 'Excessive AWS permissions',
          severity: 'high'
        }]
      };
      
      // Act
      const result = mcpServer.generate_recommendations(context);
      
      // Assert
      expect(result.some(r => r.type === 'scope_reduction')).toBeTruthy();
    });
    
    it('should recommend secret manager for plaintext credentials', () => {
      // Arrange
      const context = {
        service_dependencies: [{
          service: ServiceType.GENERIC,
          dependency_type: 'direct',
          confidence: 0.95
        }],
        potential_vulnerabilities: [{
          type: 'plaintext_credentials',
          description: 'Credential exposed in plaintext',
          severity: 'high'
        }]
      };
      
      // Act
      const result = mcpServer.generate_recommendations(context);
      
      // Assert
      expect(result.some(r => r.type === 'secret_manager')).toBeTruthy();
    });
  });
});
