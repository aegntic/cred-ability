import { logger } from '../common/logger';
import { EncryptionService } from './encryption/encryption-service';
import { KeyDerivationService } from './encryption/key-derivation-service';
import { CredentialRepository } from './storage/credential-repository';
import {
  StoredCredential,
  CredentialStatus,
  CredentialFilter,
  QueryOptions,
  QueryResult,
  CredentialCreateOptions,
  CredentialUpdateOptions
} from './storage/types';
import { KeyInfo, DerivedKey } from './encryption/types';

/**
 * Main service for the Credential Vault
 * 
 * Coordinates between the encryption service, key derivation service,
 * and credential repository to provide secure credential storage and management.
 */
export class VaultService {
  private encryptionService: EncryptionService;
  private keyDerivationService: KeyDerivationService;
  private credentialRepository: CredentialRepository;
  private isUnlocked: boolean;
  
  /**
   * Create a new VaultService
   */
  constructor() {
    this.encryptionService = new EncryptionService();
    this.keyDerivationService = new KeyDerivationService();
    this.credentialRepository = new CredentialRepository(this.encryptionService);
    this.isUnlocked = false;
    
    logger.info('Vault service initialized');
  }
  
  /**
   * Unlock the vault with a password
   * 
   * @param password Password to unlock the vault
   * @param derivedKey Optional previously derived key
   * @returns Whether the unlock was successful
   */
  public async unlock(password: string, derivedKey?: DerivedKey): Promise<boolean> {
    try {
      logger.info('Unlocking vault');
      
      if (derivedKey) {
        // Verify the password using the provided derived key
        const isValid = await this.keyDerivationService.verifyPassword(password, derivedKey);
        
        if (!isValid) {
          logger.warn('Invalid password for vault unlock');
          return false;
        }
      } else {
        // For development/testing, any password is accepted
        // In production, would verify against a stored key
        await this.keyDerivationService.deriveKey(password);
      }
      
      // Set the vault as unlocked
      this.isUnlocked = true;
      
      return true;
    } catch (error) {
      logger.error('Error unlocking vault', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return false;
    }
  }
  
  /**
   * Lock the vault
   */
  public lock(): void {
    logger.info('Locking vault');
    
    this.isUnlocked = false;
  }
  
  /**
   * Check if the vault is unlocked
   * 
   * @returns Whether the vault is unlocked
   */
  public isVaultUnlocked(): boolean {
    return this.isUnlocked;
  }
  
  /**
   * Create a new credential in the vault
   * 
   * @param options Credential creation options
   * @returns Created credential
   */
  public async createCredential(options: CredentialCreateOptions): Promise<StoredCredential> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.createCredential(options);
  }
  
  /**
   * Get a credential by ID
   * 
   * @param id Credential ID
   * @param includeValue Whether to decrypt and include the credential value
   * @returns Retrieved credential
   */
  public async getCredential(id: string, includeValue = false): Promise<StoredCredential | null> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.getCredential(id, includeValue);
  }
  
  /**
   * Update a credential
   * 
   * @param id Credential ID
   * @param options Update options
   * @returns Updated credential
   */
  public async updateCredential(id: string, options: CredentialUpdateOptions): Promise<StoredCredential | null> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.updateCredential(id, options);
  }
  
  /**
   * Delete a credential
   * 
   * @param id Credential ID
   * @returns True if deleted, false if not found
   */
  public async deleteCredential(id: string): Promise<boolean> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.deleteCredential(id);
  }
  
  /**
   * Find credentials matching the given filter
   * 
   * @param options Query options
   * @returns Query result with matched credentials
   */
  public async findCredentials(options: QueryOptions = {}): Promise<QueryResult<StoredCredential>> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.findCredentials(options);
  }
  
  /**
   * Rotate a credential
   * 
   * @param id Credential ID
   * @param newValue New credential value
   * @returns Updated credential
   */
  public async rotateCredential(id: string, newValue: string): Promise<StoredCredential | null> {
    this.ensureVaultUnlocked();
    
    return this.credentialRepository.rotateCredential(id, newValue);
  }
  
  /**
   * Generate a new encryption key
   * 
   * @returns Information about the new key
   */
  public generateNewKey(): KeyInfo {
    this.ensureVaultUnlocked();
    
    return this.encryptionService.generateNewKey();
  }
  
  /**
   * Get information about available encryption keys
   * 
   * @returns Array of key information objects
   */
  public getKeyInfo(): KeyInfo[] {
    this.ensureVaultUnlocked();
    
    return this.encryptionService.getKeyInfo();
  }
  
  /**
   * Update the parameters used for key derivation
   * 
   * @param memory Memory usage in KiB
   * @param iterations Number of iterations
   * @param parallelism Parallelism factor
   */
  public updateKeyDerivationParameters(
    memory?: number,
    iterations?: number,
    parallelism?: number
  ): void {
    this.ensureVaultUnlocked();
    
    this.keyDerivationService.updateParameters(memory, iterations, parallelism);
  }
  
  /**
   * Ensure the vault is unlocked
   * 
   * @throws Error if the vault is locked
   */
  private ensureVaultUnlocked(): void {
    if (!this.isUnlocked) {
      logger.error('Attempted to access vault while locked');
      throw new Error('Vault is locked');
    }
  }
}
