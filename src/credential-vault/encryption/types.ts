/**
 * Types for the credential vault encryption services
 */

export interface EncryptedData {
  ciphertext: string;   // Base64-encoded encrypted data
  iv: string;           // Initialization vector
  tag: string;          // Authentication tag
  algorithm: string;    // Algorithm identifier
  keyId: string;        // ID of the DEK used
  version: number;      // Encryption scheme version
}

export interface CredentialMetadata {
  id: string;
  type: string;
  service?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export interface DerivedKey {
  key: string;           // Base64-encoded derived key
  salt: string;          // Base64-encoded salt
  algorithm: string;     // Algorithm identifier (e.g., "argon2id")
  parameters: {          // Algorithm-specific parameters
    memory: number;
    iterations: number;
    parallelism: number;
  };
  version: number;       // Key derivation scheme version
}

export interface KeyInfo {
  keyId: string;
  createdAt: Date;
  algorithm: string;
  version: number;
  status: 'active' | 'rotated' | 'compromised' | 'expired';
}
