import crypto from 'crypto';
import argon2 from 'argon2';
import { logger, zeroize } from '../../common/logger';
import { DerivedKey } from './types';

/**
 * Service responsible for secure key derivation from passwords
 * 
 * Implements Argon2id for password-based key derivation with
 * configurable parameters for memory, iterations, and parallelism.
 */
export class KeyDerivationService {
  private memory: number;
  private iterations: number;
  private parallelism: number;
  private hashLength: number;
  
  /**
   * Create a new KeyDerivationService
   * 
   * @param memory Memory usage in KiB (default: 65536)
   * @param iterations Number of iterations (default: 3)
   * @param parallelism Parallelism factor (default: 4)
   * @param hashLength Length of derived key in bytes (default: 32)
   */
  constructor(
    memory = 65536,
    iterations = 3,
    parallelism = 4,
    hashLength = 32
  ) {
    this.memory = memory;
    this.iterations = iterations;
    this.parallelism = parallelism;
    this.hashLength = hashLength;
    
    logger.info('Key derivation service initialized', {
      memory,
      iterations,
      parallelism,
      hashLength
    });
  }
  
  /**
   * Derive a key from a password or passphrase
   * 
   * @param password The password to derive key from
   * @param salt Optional salt (generated if not provided)
   * @returns Promise resolving to derived key information
   */
  public async deriveKey(password: string, salt?: string): Promise<DerivedKey> {
    try {
      // Generate a random salt if not provided
      const saltBuffer = salt 
        ? Buffer.from(salt, 'base64') 
        : crypto.randomBytes(16);
      
      // Configure Argon2 options
      const options = {
        type: argon2.argon2id,
        memoryCost: this.memory,
        timeCost: this.iterations,
        parallelism: this.parallelism,
        hashLength: this.hashLength,
        salt: saltBuffer,
        raw: true // Return the raw hash as a Buffer
      };
      
      // Derive the key using Argon2id
      const derivedKeyBuffer = await argon2.hash(password, options);
      
      // Return the derived key information
      return {
        key: Buffer.from(derivedKeyBuffer).toString('base64'),
        salt: saltBuffer.toString('base64'),
        algorithm: 'argon2id',
        parameters: {
          memory: this.memory,
          iterations: this.iterations,
          parallelism: this.parallelism
        },
        version: 1
      };
    } catch (error) {
      logger.error('Error deriving key', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to derive key');
    } finally {
      // Clear the password from memory as soon as possible
      zeroize(password);
    }
  }
  
  /**
   * Verify a password against a previously derived key
   * 
   * @param password The password to verify
   * @param derivedKey The previously derived key information
   * @returns Promise resolving to true if the password is valid
   */
  public async verifyPassword(password: string, derivedKey: DerivedKey): Promise<boolean> {
    try {
      // Parse the stored key and salt
      const keyBuffer = Buffer.from(derivedKey.key, 'base64');
      const saltBuffer = Buffer.from(derivedKey.salt, 'base64');
      
      // Configure Argon2 options based on stored parameters
      const options = {
        type: argon2.argon2id,
        memoryCost: derivedKey.parameters.memory,
        timeCost: derivedKey.parameters.iterations,
        parallelism: derivedKey.parameters.parallelism,
        hashLength: keyBuffer.length,
        salt: saltBuffer,
        raw: true // Return the raw hash as a Buffer
      };
      
      // Derive a key from the provided password with the same parameters
      const derivedKeyBuffer = await argon2.hash(password, options);
      
      // Compare the derived key with the stored key using constant-time comparison
      return crypto.timingSafeEqual(
        Buffer.from(derivedKeyBuffer),
        keyBuffer
      );
    } catch (error) {
      logger.error('Error verifying password', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error('Failed to verify password');
    } finally {
      // Clear the password from memory as soon as possible
      zeroize(password);
    }
  }
  
  /**
   * Update the parameters used for key derivation
   * 
   * @param memory Memory usage in KiB
   * @param iterations Number of iterations
   * @param parallelism Parallelism factor
   */
  public updateParameters(memory?: number, iterations?: number, parallelism?: number): void {
    if (memory !== undefined) {
      this.memory = memory;
    }
    
    if (iterations !== undefined) {
      this.iterations = iterations;
    }
    
    if (parallelism !== undefined) {
      this.parallelism = parallelism;
    }
    
    logger.info('Key derivation parameters updated', {
      memory: this.memory,
      iterations: this.iterations,
      parallelism: this.parallelism
    });
  }
}
