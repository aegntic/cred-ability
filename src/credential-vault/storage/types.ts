/**
 * Types for the credential vault storage services
 */
import { EncryptedData, CredentialMetadata } from '../encryption/types';

export interface StoredCredential {
  id: string;
  name: string;
  type: string;
  service?: string;
  encryptedData: EncryptedData;
  metadata: CredentialMetadata;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastRotated?: Date;
  expiresAt?: Date;
  status: CredentialStatus;
}

export enum CredentialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  COMPROMISED = 'compromised'
}

export interface CredentialFilter {
  id?: string;
  name?: string;
  type?: string;
  service?: string;
  status?: CredentialStatus;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface QueryOptions {
  filter?: CredentialFilter;
  pagination?: PaginationOptions;
  sort?: SortOptions;
}

export interface QueryResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CredentialCreateOptions {
  name: string;
  type: string;
  value: string;
  service?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  expiresAt?: Date;
}

export interface CredentialUpdateOptions {
  name?: string;
  service?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  status?: CredentialStatus;
  expiresAt?: Date;
}
