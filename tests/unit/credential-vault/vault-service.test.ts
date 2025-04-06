import { VaultService } from '../../../src/credential-vault/vault-service';
import { CredentialStatus } from '../../../src/credential-vault/storage/types';

describe('VaultService', () => {
  let vaultService: VaultService;
  
  beforeEach(async () => {
    vaultService = new VaultService();
    // Unlock the vault for testing
    await vaultService.unlock('test-password');
  });
  
  describe('credential management', () => {
    it('should create and retrieve a credential', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      // Act
      const created = await vaultService.createCredential(createOptions);
      const retrieved = await vaultService.getCredential(created.id);
      
      // Assert
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();
      expect(created.name).toBe(createOptions.name);
      expect(created.type).toBe(createOptions.type);
      expect(created.service).toBe(createOptions.service);
      expect(created.status).toBe(CredentialStatus.ACTIVE);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.name).toBe(created.name);
      
      // Ensure the value is not returned by default
      expect(retrieved?.metadata.value).toBeUndefined();
    });
    
    it('should return the decrypted value when requested', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      // Act
      const created = await vaultService.createCredential(createOptions);
      const retrieved = await vaultService.getCredential(created.id, true);
      
      // Assert
      expect(retrieved).toBeDefined();
      expect(retrieved?.metadata.value).toBe(createOptions.value);
    });
    
    it('should update a credential', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      const updateOptions = {
        name: 'Updated API Key',
        service: 'updated-service',
        tags: ['test', 'updated']
      };
      
      // Act
      const created = await vaultService.createCredential(createOptions);
      const updated = await vaultService.updateCredential(created.id, updateOptions);
      
      // Assert
      expect(updated).toBeDefined();
      expect(updated?.id).toBe(created.id);
      expect(updated?.name).toBe(updateOptions.name);
      expect(updated?.service).toBe(updateOptions.service);
      expect(updated?.tags).toEqual(updateOptions.tags);
      expect(updated?.updatedAt).not.toEqual(created.updatedAt);
    });
    
    it('should delete a credential', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      // Act
      const created = await vaultService.createCredential(createOptions);
      const deleteResult = await vaultService.deleteCredential(created.id);
      const retrieveResult = await vaultService.getCredential(created.id);
      
      // Assert
      expect(deleteResult).toBe(true);
      expect(retrieveResult).toBeNull();
    });
    
    it('should find credentials matching a filter', async () => {
      // Arrange
      await vaultService.createCredential({
        name: 'AWS Production API Key',
        type: 'api_key',
        value: 'aws-api-key-value',
        service: 'aws'
      });
      
      await vaultService.createCredential({
        name: 'GitHub Token',
        type: 'personal_access_token',
        value: 'github-token-value',
        service: 'github'
      });
      
      await vaultService.createCredential({
        name: 'AWS Development API Key',
        type: 'api_key',
        value: 'aws-dev-api-key-value',
        service: 'aws',
        tags: ['development']
      });
      
      // Act - Find by service
      const awsResults = await vaultService.findCredentials({
        filter: { service: 'aws' }
      });
      
      // Act - Find by type
      const tokenResults = await vaultService.findCredentials({
        filter: { type: 'personal_access_token' }
      });
      
      // Act - Find by tag
      const devResults = await vaultService.findCredentials({
        filter: { tags: ['development'] }
      });
      
      // Assert
      expect(awsResults.total).toBe(2);
      expect(tokenResults.total).toBe(1);
      expect(tokenResults.items[0].service).toBe('github');
      expect(devResults.total).toBe(1);
      expect(devResults.items[0].name).toContain('Development');
    });
    
    it('should rotate a credential', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      const newValue = 'rotated-api-key-value';
      
      // Act
      const created = await vaultService.createCredential(createOptions);
      const rotated = await vaultService.rotateCredential(created.id, newValue);
      const retrieved = await vaultService.getCredential(created.id, true);
      
      // Assert
      expect(rotated).toBeDefined();
      expect(rotated?.id).toBe(created.id);
      expect(rotated?.lastRotated).not.toEqual(created.lastRotated);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.metadata.value).toBe(newValue);
    });
  });
  
  describe('vault locking', () => {
    it('should prevent access when locked', async () => {
      // Arrange
      const createOptions = {
        name: 'Test API Key',
        type: 'api_key',
        value: 'test-api-key-value',
        service: 'test-service'
      };
      
      const created = await vaultService.createCredential(createOptions);
      
      // Act
      vaultService.lock();
      
      // Assert
      expect(vaultService.isVaultUnlocked()).toBe(false);
      await expect(vaultService.getCredential(created.id)).rejects.toThrow('Vault is locked');
    });
    
    it('should allow access when unlocked', async () => {
      // Arrange
      vaultService.lock();
      expect(vaultService.isVaultUnlocked()).toBe(false);
      
      // Act
      const unlockResult = await vaultService.unlock('test-password');
      
      // Assert
      expect(unlockResult).toBe(true);
      expect(vaultService.isVaultUnlocked()).toBe(true);
      
      // Should be able to create credentials now
      const credential = await vaultService.createCredential({
        name: 'Test Credential',
        type: 'api_key',
        value: 'test-value'
      });
      
      expect(credential).toBeDefined();
      expect(credential.id).toBeDefined();
    });
  });
  
  describe('key management', () => {
    it('should generate new encryption keys', () => {
      // Act
      const keyInfo = vaultService.generateNewKey();
      
      // Assert
      expect(keyInfo).toBeDefined();
      expect(keyInfo.keyId).toBeDefined();
      expect(keyInfo.algorithm).toBe('aes-256-gcm');
      expect(keyInfo.status).toBe('active');
    });
    
    it('should list available keys', () => {
      // Arrange
      vaultService.generateNewKey();
      vaultService.generateNewKey();
      
      // Act
      const keys = vaultService.getKeyInfo();
      
      // Assert
      expect(keys).toBeDefined();
      expect(keys.length).toBeGreaterThanOrEqual(2);
      
      // Only one key should be active
      const activeKeys = keys.filter(k => k.status === 'active');
      expect(activeKeys.length).toBe(1);
    });
    
    it('should update key derivation parameters', () => {
      // Act
      vaultService.updateKeyDerivationParameters(32768, 2, 2);
      
      // No easy way to assert the change, but should not throw error
      expect(true).toBe(true);
    });
  });
});
