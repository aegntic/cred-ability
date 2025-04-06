import * as argon2 from 'argon2';
import crypto from 'crypto';
import { promisify } from 'util';
import { logger } from '../../common/logger';
import { DerivedKey } from './types';

// Promisify crypto functions
const randomBytes = promisify(crypto.randomBytes);

/**
 * KeyDerivationService for secure key derivation from passwords/passphrases
 * 
 * Implements the key derivation strategy specified in the SRS:
 * - Argon2id for key derivation
 * - Configurable parameters for memory, iterations, and parallelism
 */
export class KeyDerivationService {
  private static instance: KeyDerivationService;
  
  // Default parameters as specified in the SRS
  private readonly defaultParameters = {
    memory: 65536,       // 64 MB
    iterations: 3,
    parallelism: 4,
    hashLength: 32,      // 256 bits
    saltLength: 16       // 128 bits
  };
  
  /**
   * Get singleton instance of KeyDerivationService
   */
  public static getInstance(): KeyDerivationService {
    if (!KeyDerivationService.instance) {
      KeyDerivationService.instance = new KeyDerivationService();
    }
    return KeyDerivationService.instance;
  }
  
  /**
   * Derive a key from a password/passphrase
   * 
   * @param password The password or passphrase
   * @param salt Optional salt (generated if not provided)
   * @param parameters Optional custom parameters
   * @returns The derived key object
   */
  public async deriveKey(
    password: string,
    salt?: string,
    parameters?: Partial<typeof this.defaultParameters>
  ): Promise<DerivedKey> {
    try {
      // Merge default parameters with any overrides
      const mergedParams = { ...this.defaultParameters, ...parameters };
      
      // Generate a salt if not provided
      const saltBuffer = salt
        ? Buffer.from(salt, 'base64')
        : await randomBytes(mergedParams.saltLength);
      
      // Derive key using Argon2id
      const derivedKey = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: mergedParams.memory,
        timeCost: mergedParams.iterations,
        parallelism: mergedParams.parallelism,
        hashLength: mergedParams.hashLength,
        salt: saltBuffer,
        raw: true
      });
      
      return {
        key: Buffer.from(derivedKey).toString('base64'),
        salt: saltBuffer.toString('base64'),
        algorithm: 'argon2id',
        parameters: {
          memory: mergedParams.memory,
          iterations: mergedParams.iterations,
          parallelism: mergedParams.parallelism
        },
        version: 1
      };
    } catch (error) {
      logger.error('Key derivation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new Error(`Failed to derive key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Verify a password against a stored derived key
   * 
   * @param password The password to verify
   * @param derivedKey The previously derived key
   * @returns Whether the password matches
   */
  public async verifyPassword(password: string, derivedKey: DerivedKey): Promise<boolean> {
    try {
      // Extract parameters from the stored derived key
      const { parameters, salt, key, algorithm } = derivedKey;
      
      if (algorithm !== 'argon2id') {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
      
      // Derive a key with the same parameters
      const verificationKey = await this.deriveKey(password, salt, parameters);
      
      // Compare the keys using a constant-time comparison
      return crypto.timingSafeEqual(
        Buffer.from(verificationKey.key, 'base64'),
        Buffer.from(key, 'base64')
      );
    } catch (error) {
      logger.error('Password verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  }
  
  /**
   * Check if the current parameters need strengthening based on hardware capabilities
   * 
   * @returns Whether parameters should be strengthened
   */
  public async parametersNeedStrengthening(): Promise<boolean> {
    try {
      const startTime = process.hrtime.bigint();
      
      // Perform a test derivation
      await this.deriveKey('test-password');
      
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;
      
      // If derivation takes less than 250ms, consider strengthening parameters
      return durationMs < 250;
    } catch (error) {
      // If we can't measure, assume no strengthening needed
      return false;
    }
  }
  
  /**
   * Get recommended parameters based on current hardware capabilities
   * 
   * @returns Recommended parameters
   */
  public async getRecommendedParameters(): Promise<{
    memory: number;
    iterations: number;
    parallelism: number;
  }> {
    if (await this.parametersNeedStrengthening()) {
      // Increase memory cost for faster systems
      return {
        memory: this.defaultParameters.memory * 2,
        iterations: this.defaultParameters.iterations + 1,
        parallelism: this.defaultParameters.parallelism
      };
    }
    
    return {
      memory: this.defaultParameters.memory,
      iterations: this.defaultParameters.iterations,
      parallelism: this.defaultParameters.parallelism
    };
  }
}
