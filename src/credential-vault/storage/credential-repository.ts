import { v4 as uuidv4 } from 'uuid';
import { logger, maskCredential } from '../../common/logger';
import { EncryptionService } from '../encryption/encryption-service';
import {
  StoredCredential,
  CredentialStatus,
  CredentialFilter,
  QueryOptions,
  QueryResult,
  CredentialCreateOptions,
  CredentialUpdateOptions
} from './types';
import { CredentialMetadata } from '../encryption/types';

/**
 * Repository for storing and retrieving credentials
 * 
 * This implementation uses an in-memory store for development/testing.
 * A production implementation would use a database or other persistent storage.
 */
export class CredentialRepository {
  private credentials: Map<string, StoredCredential>;
  private encryptionService: EncryptionService;
  
  /**
   * Create a new CredentialRepository
   * 
   * @param encryptionService Service for encrypting/decrypting credentials
   */
  constructor(encryptionService: EncryptionService) {
    this.credentials = new Map<string, StoredCredential>();
    this.encryptionService = encryptionService;
    
    logger.info('Credential repository initialized');
  }
  
  /**
   * Create a new credential
   * 
   * @param options Credential creation options
   * @returns Created credential
   */
  public async createCredential(options: CredentialCreateOptions): Promise<StoredCredential> {
    try {
      logger.info('Creating credential', {
        name: options.name,
        type: options.type,
        service: options.service
      });
      
      // Generate a unique ID
      const id = uuidv4();
      
      // Create metadata
      const metadata: CredentialMetadata = {
        id,
        type: options.type,
        service: options.service,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options.metadata
      };
      
      // Encrypt the credential value
      const encryptedData = this.encryptionService.encryptCredential(options.value, metadata);
      
      // Create the stored credential
      const credential: StoredCredential = {
        id,
        name: options.name,
        type: options.type,
        service: options.service,
        encryptedData,
        metadata,
        tags: options.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastRotated: new Date(),
        expiresAt: options.expiresAt,
        status: CredentialStatus.ACTIVE
      };
      
      // Store the credential
      this.credentials.set(id, credential);
      
      // Return the stored credential (without sensitive data)
      return this.sanitizeCredential(credential);
    } catch (error) {
      logger.error('Error creating credential', {
        name: options.name,
        type: options.type,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to create credential');
    }
  }
  
  /**
   * Get a credential by ID
   * 
   * @param id Credential ID
   * @param includeValue Whether to decrypt and include the credential value
   * @returns Retrieved credential
   */
  public async getCredential(id: string, includeValue = false): Promise<StoredCredential | null> {
    try {
      logger.debug('Getting credential', { id, includeValue });
      
      // Find the credential
      const credential = this.credentials.get(id);
      
      if (!credential) {
        logger.debug('Credential not found', { id });
        return null;
      }
      
      // If the value is requested, decrypt it
      if (includeValue) {
        const value = this.encryptionService.decryptCredential(
          credential.encryptedData,
          credential.metadata
        );
        
        // Return a copy with the decrypted value
        return {
          ...credential,
          metadata: {
            ...credential.metadata,
            value
          }
        };
      }
      
      // Return the credential without sensitive data
      return this.sanitizeCredential(credential);
    } catch (error) {
      logger.error('Error getting credential', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to get credential');
    }
  }
  
  /**
   * Update a credential
   * 
   * @param id Credential ID
   * @param options Update options
   * @returns Updated credential
   */
  public async updateCredential(id: string, options: CredentialUpdateOptions): Promise<StoredCredential | null> {
    try {
      logger.info('Updating credential', { id });
      
      // Find the credential
      const credential = this.credentials.get(id);
      
      if (!credential) {
        logger.debug('Credential not found for update', { id });
        return null;
      }
      
      // Update the credential fields
      if (options.name) {
        credential.name = options.name;
      }
      
      if (options.service) {
        credential.service = options.service;
        credential.metadata.service = options.service;
      }
      
      if (options.metadata) {
        credential.metadata = {
          ...credential.metadata,
          ...options.metadata,
          id,
          type: credential.type
        };
      }
      
      if (options.tags) {
        credential.tags = options.tags;
      }
      
      if (options.status) {
        credential.status = options.status;
      }
      
      if (options.expiresAt) {
        credential.expiresAt = options.expiresAt;
      }
      
      // Update timestamp
      credential.updatedAt = new Date();
      credential.metadata.updatedAt = new Date();
      
      // Store the updated credential
      this.credentials.set(id, credential);
      
      // Return the updated credential without sensitive data
      return this.sanitizeCredential(credential);
    } catch (error) {
      logger.error('Error updating credential', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to update credential');
    }
  }
  
  /**
   * Delete a credential
   * 
   * @param id Credential ID
   * @returns True if deleted, false if not found
   */
  public async deleteCredential(id: string): Promise<boolean> {
    try {
      logger.info('Deleting credential', { id });
      
      // Attempt to delete the credential
      const result = this.credentials.delete(id);
      
      return result;
    } catch (error) {
      logger.error('Error deleting credential', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to delete credential');
    }
  }
  
  /**
   * Find credentials matching the given filter
   * 
   * @param options Query options
   * @returns Query result with matched credentials
   */
  public async findCredentials(options: QueryOptions = {}): Promise<QueryResult<StoredCredential>> {
    try {
      logger.debug('Finding credentials', { options });
      
      // Get all credentials as an array
      let credentials = Array.from(this.credentials.values());
      
      // Apply filters if provided
      if (options.filter) {
        credentials = this.applyFilter(credentials, options.filter);
      }
      
      // Apply sorting if provided
      if (options.sort) {
        credentials = this.applySort(credentials, options.sort);
      }
      
      // Get total count before pagination
      const total = credentials.length;
      
      // Apply pagination if provided
      const pagination = options.pagination || { page: 1, limit: 20 };
      const page = pagination.page;
      const limit = pagination.limit;
      
      const start = (page - 1) * limit;
      const end = page * limit;
      
      credentials = credentials.slice(start, end);
      
      // Calculate total pages
      const pages = Math.ceil(total / limit);
      
      // Sanitize credentials before returning
      const sanitizedCredentials = credentials.map(c => this.sanitizeCredential(c));
      
      return {
        items: sanitizedCredentials,
        total,
        page,
        limit,
        pages
      };
    } catch (error) {
      logger.error('Error finding credentials', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to find credentials');
    }
  }
  
  /**
   * Rotate a credential
   * 
   * @param id Credential ID
   * @param newValue New credential value
   * @returns Updated credential
   */
  public async rotateCredential(id: string, newValue: string): Promise<StoredCredential | null> {
    try {
      logger.info('Rotating credential', { id });
      
      // Find the credential
      const credential = this.credentials.get(id);
      
      if (!credential) {
        logger.debug('Credential not found for rotation', { id });
        return null;
      }
      
      // Encrypt the new value
      const encryptedData = this.encryptionService.encryptCredential(
        newValue,
        credential.metadata
      );
      
      // Update the credential
      credential.encryptedData = encryptedData;
      credential.lastRotated = new Date();
      credential.updatedAt = new Date();
      credential.metadata.updatedAt = new Date();
      
      // Store the updated credential
      this.credentials.set(id, credential);
      
      // Return the updated credential without sensitive data
      return this.sanitizeCredential(credential);
    } catch (error) {
      logger.error('Error rotating credential', {
        id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to rotate credential');
    }
  }
  
  /**
   * Apply filters to credentials
   * 
   * @param credentials Array of credentials
   * @param filter Filter criteria
   * @returns Filtered credentials
   */
  private applyFilter(credentials: StoredCredential[], filter: CredentialFilter): StoredCredential[] {
    return credentials.filter(credential => {
      // Filter by ID
      if (filter.id && credential.id !== filter.id) {
        return false;
      }
      
      // Filter by name
      if (filter.name && !credential.name.includes(filter.name)) {
        return false;
      }
      
      // Filter by type
      if (filter.type && credential.type !== filter.type) {
        return false;
      }
      
      // Filter by service
      if (filter.service && credential.service !== filter.service) {
        return false;
      }
      
      // Filter by status
      if (filter.status && credential.status !== filter.status) {
        return false;
      }
      
      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        if (!credential.tags || !filter.tags.every(tag => credential.tags?.includes(tag))) {
          return false;
        }
      }
      
      // Filter by creation date
      if (filter.createdAfter && credential.createdAt < filter.createdAfter) {
        return false;
      }
      
      if (filter.createdBefore && credential.createdAt > filter.createdBefore) {
        return false;
      }
      
      // Filter by update date
      if (filter.updatedAfter && credential.updatedAt < filter.updatedAfter) {
        return false;
      }
      
      if (filter.updatedBefore && credential.updatedAt > filter.updatedBefore) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Apply sorting to credentials
   * 
   * @param credentials Array of credentials
   * @param sort Sort options
   * @returns Sorted credentials
   */
  private applySort(
    credentials: StoredCredential[],
    sort: { field: string; direction: 'asc' | 'desc' }
  ): StoredCredential[] {
    return [...credentials].sort((a, b) => {
      // Get the values to compare
      const aValue = this.getFieldValue(a, sort.field);
      const bValue = this.getFieldValue(b, sort.field);
      
      // Compare the values
      if (aValue < bValue) {
        return sort.direction === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sort.direction === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  
  /**
   * Get a field value from a credential
   * 
   * @param credential Credential object
   * @param field Field name
   * @returns Field value
   */
  private getFieldValue(credential: StoredCredential, field: string): any {
    // Check if the field is a direct property
    if (field in credential) {
      return (credential as any)[field];
    }
    
    // Check if the field is in metadata
    if (credential.metadata && field in credential.metadata) {
      return credential.metadata[field];
    }
    
    // Default to null if field not found
    return null;
  }
  
  /**
   * Sanitize a credential for external use
   * 
   * Removes sensitive data like encryption details
   * 
   * @param credential Credential to sanitize
   * @returns Sanitized credential
   */
  private sanitizeCredential(credential: StoredCredential): StoredCredential {
    // Create a copy without the encrypted data details
    const sanitized: StoredCredential = {
      ...credential,
      // Remove sensitive encryption details
      encryptedData: {
        ...credential.encryptedData,
        ciphertext: '[REDACTED]',
        iv: '[REDACTED]',
        tag: '[REDACTED]'
      }
    };
    
    return sanitized;
  }
}
