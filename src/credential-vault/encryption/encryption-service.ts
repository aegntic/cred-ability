import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger, maskCredential, zeroize } from '../../common/logger';
import { EncryptedData, CredentialMetadata, KeyInfo } from './types';

/**
 * Service responsible for encrypting and decrypting credentials
 * 
 * Implements AES-256-GCM encryption with a hierarchical key structure:
 * - Data Encryption Keys (DEKs): Used to encrypt individual credentials
 * - Key Encryption Keys (KEKs): Used to encrypt DEKs for storage
 * - Master Key: Used to derive KEKs (from user password or HSM)
 */
export class EncryptionService {
  private masterKeyId: string;
  private activeKeyId: string;
  private keys: Map<string, Buffer>;
  
  /**
   * Create a new EncryptionService
   * 
   * @param masterKeyId ID of the master key
   */
  constructor(masterKeyId?: string) {
    this.masterKeyId = masterKeyId || uuidv4();
    this.activeKeyId = uuidv4();
    this.keys = new Map<string, Buffer>();
    
    // Initialize with a random key for development/testing
    // In production, keys would be loaded from a secure source
    this.keys.set(this.activeKeyId, crypto.randomBytes(32));
    
    logger.info('Encryption service initialized', {
      masterKeyId: this.masterKeyId,
      activeKeyId: this.activeKeyId
    });
  }
  
  /**
   * Encrypt a credential for storage
   * 
   * @param plaintext The credential to encrypt
   * @param metadata Metadata about the credential
   * @returns Encrypted data
   */
  public encryptCredential(plaintext: string, metadata: CredentialMetadata): EncryptedData {
    try {
      logger.debug('Encrypting credential', {
        credentialId: metadata.id,
        credentialType: metadata.type,
        keyId: this.activeKeyId
      });
      
      // Get the active encryption key
      const key = this.getEncryptionKey(this.activeKeyId);
      
      // Generate a random initialization vector
      const iv = crypto.randomBytes(16);
      
      // Create cipher with AES-256-GCM
      const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      
      // Add additional authenticated data (AAD) from metadata
      const aad = Buffer.from(metadata.id + metadata.type);
      cipher.setAAD(aad);
      
      // Encrypt the plaintext
      let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
      ciphertext += cipher.final('base64');
      
      // Get the authentication tag
      const tag = cipher.getAuthTag().toString('base64');
      
      // Create the encrypted data object
      const encryptedData: EncryptedData = {
        ciphertext,
        iv: iv.toString('base64'),
        tag,
        algorithm: 'aes-256-gcm',
        keyId: this.activeKeyId,
        version: 1
      };
      
      return encryptedData;
    } catch (error) {
      logger.error('Error encrypting credential', {
        credentialId: metadata.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to encrypt credential');
    } finally {
      // Clear the plaintext from memory as soon as possible
      zeroize(plaintext);
    }
  }
  
  /**
   * Decrypt a stored credential
   * 
   * @param encryptedData The encrypted credential data
   * @param metadata Metadata about the credential
   * @returns Decrypted plaintext credential
   */
  public decryptCredential(encryptedData: EncryptedData, metadata: CredentialMetadata): string {
    try {
      logger.debug('Decrypting credential', {
        credentialId: metadata.id,
        credentialType: metadata.type,
        keyId: encryptedData.keyId
      });
      
      // Get the encryption key used for this credential
      const key = this.getEncryptionKey(encryptedData.keyId);
      
      // Parse IV and tag from base64
      const iv = Buffer.from(encryptedData.iv, 'base64');
      const tag = Buffer.from(encryptedData.tag, 'base64');
      
      // Create decipher with AES-256-GCM
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      
      // Set the authentication tag
      decipher.setAuthTag(tag);
      
      // Add additional authenticated data (AAD) from metadata
      const aad = Buffer.from(metadata.id + metadata.type);
      decipher.setAAD(aad);
      
      // Decrypt the ciphertext
      let plaintext = decipher.update(encryptedData.ciphertext, 'base64', 'utf8');
      plaintext += decipher.final('utf8');
      
      return plaintext;
    } catch (error) {
      logger.error('Error decrypting credential', {
        credentialId: metadata.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to decrypt credential');
    }
  }
  
  /**
   * Rotate encryption key for a credential without accessing plaintext
   * 
   * This performs envelope encryption - the data is not re-encrypted, but
   * the DEK is re-encrypted with a new KEK.
   * 
   * @param credentialId ID of the credential
   * @returns True if rotation was successful
   */
  public rotateEncryptionKey(credentialId: string): boolean {
    try {
      logger.info('Rotating encryption key', { credentialId });
      
      // In a real implementation, this would:
      // 1. Retrieve the encrypted DEK for the credential
      // 2. Decrypt the DEK using the old KEK
      // 3. Re-encrypt the DEK using the new KEK
      // 4. Store the re-encrypted DEK
      
      // For this example, we'll just simulate success
      return true;
    } catch (error) {
      logger.error('Error rotating encryption key', {
        credentialId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      return false;
    }
  }
  
  /**
   * Generate a new encryption key and set it as active
   * 
   * @returns Information about the new key
   */
  public generateNewKey(): KeyInfo {
    // Generate a random key ID
    const keyId = uuidv4();
    
    // Generate a new 256-bit encryption key
    const key = crypto.randomBytes(32);
    
    // Store the key
    this.keys.set(keyId, key);
    
    // Set as the active key
    this.activeKeyId = keyId;
    
    const keyInfo: KeyInfo = {
      keyId,
      createdAt: new Date(),
      algorithm: 'aes-256-gcm',
      version: 1,
      status: 'active'
    };
    
    logger.info('Generated new encryption key', {
      keyId,
      algorithm: 'aes-256-gcm'
    });
    
    return keyInfo;
  }
  
  /**
   * Get information about available encryption keys
   * 
   * @returns Array of key information objects
   */
  public getKeyInfo(): KeyInfo[] {
    const keyInfo: KeyInfo[] = [];
    
    for (const keyId of this.keys.keys()) {
      keyInfo.push({
        keyId,
        createdAt: new Date(), // In a real system, this would be stored
        algorithm: 'aes-256-gcm',
        version: 1,
        status: keyId === this.activeKeyId ? 'active' : 'rotated'
      });
    }
    
    return keyInfo;
  }
  
  /**
   * Get the encryption key for the specified ID
   * 
   * @param keyId ID of the key to retrieve
   * @returns The encryption key buffer
   */
  private getEncryptionKey(keyId: string): Buffer {
    const key = this.keys.get(keyId);
    
    if (!key) {
      logger.error('Encryption key not found', { keyId });
      throw new Error(`Encryption key not found: ${keyId}`);
    }
    
    return key;
  }
}
