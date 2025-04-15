import express from 'express';
import { logger } from '../../common/logger';
import { VaultService } from '../../credential-vault/vault-service';
import { CredentialStatus, CredentialUpdateOptions } from '../../credential-vault/storage/types';

// Singleton VaultService instance
const vaultService = new VaultService();

// Unlock the vault at startup for MVP/demo (replace with secure flow for production)
vaultService.unlock('mvp-demo-password').then(unlocked => {
  if (unlocked) {
    logger.info('Vault unlocked successfully for API operations');
  } else {
    logger.error('Failed to unlock vault at startup');
  }
});

const credentialsRouter = express.Router();

// GET /api/v1/credentials - List credentials
// Define a type for the filter parameters
interface CredentialFilter {
  type?: string;
  service?: string;
  riskLevel?: string;
  status?: CredentialStatus;
}

credentialsRouter.get('/', async (req: express.Request, res: express.Response) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  try {
    // Check if vault is unlocked
    if (!vaultService.isVaultUnlocked()) {
      logger.warn('Attempted to list credentials while vault is locked', { requestId });
      return res.status(503).json({
        status: 'error',
        error: {
          code: 'VAULT_LOCKED',
          message: 'Vault is locked, cannot perform operation.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    // Extract and validate query parameters
    const { type, service, riskLevel, status } = req.query;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '20', 10);

    // Build filter object with type safety
    const filter: CredentialFilter = {};
    if (type) filter.type = type as string;
    if (service) filter.service = service as string;
    if (riskLevel) filter.riskLevel = riskLevel as string;
    if (status && Object.values(CredentialStatus).includes(status as CredentialStatus)) {
      filter.status = status as CredentialStatus;
    }

    logger.info('Listing credentials', {
      filters: filter,
      pagination: { page, limit },
      requestId,
    });

    const result = await vaultService.findCredentials({ filter, pagination: { page, limit } });

    res.status(200).json({
      status: 'success',
      data: {
        credentials: result.items,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: result.pages,
        },
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error listing credentials', { error: errorMessage, requestId });

    res.status(500).json({
      status: 'error',
      error: {
        code: 'CREDENTIAL_LISTING_ERROR',
        message: 'Failed to list credentials',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// POST /api/v1/credentials - Create a credential
credentialsRouter.post('/', async (req: express.Request, res: express.Response) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  try {
    // Check if vault is unlocked
    if (!vaultService.isVaultUnlocked()) {
      logger.warn('Attempted to create credential while vault is locked', { requestId });
      return res.status(503).json({
        status: 'error',
        error: {
          code: 'VAULT_LOCKED',
          message: 'Vault is locked, cannot perform operation.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    // Extract data from request body
    const { name, type, service, value, metadata, tags, expiresAt } = req.body;

    // Basic validation (add more robust validation as needed)
    if (!name || !type || !value) {
      logger.warn('Missing required fields for credential creation', { requestId, body: req.body });
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'INVALID_INPUT',
          message: 'Missing required fields: name, type, value.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    logger.info('Creating credential', { name, type, service, requestId });

    const createdCredential = await vaultService.createCredential({
      name,
      type,
      service,
      value,
      metadata,
      tags,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    res.status(201).json({
      status: 'success',
      data: createdCredential,
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error creating credential', { error: errorMessage, requestId });

    res.status(500).json({
      status: 'error',
      error: {
        code: 'CREDENTIAL_CREATION_ERROR',
        message: 'Failed to create credential',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// GET /api/v1/credentials/:id - Get a specific credential
credentialsRouter.get('/:id', async (req: express.Request, res: express.Response) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  const credentialId = req.params.id;
  // Option to include decrypted value (default to false for security)
  const includeValue = req.query.includeValue === 'true';

  try {
    // Check if vault is unlocked
    if (!vaultService.isVaultUnlocked()) {
      logger.warn('Attempted to get credential while vault is locked', { credentialId, requestId });
      return res.status(503).json({
        status: 'error',
        error: {
          code: 'VAULT_LOCKED',
          message: 'Vault is locked, cannot perform operation.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    logger.info('Retrieving credential', { credentialId, includeValue, requestId });

    const credential = await vaultService.getCredential(credentialId, includeValue);

    // Handle not found case
    if (!credential) {
      logger.warn('Credential not found', { credentialId, requestId });
      return res.status(404).json({
        status: 'error',
        error: {
          code: 'CREDENTIAL_NOT_FOUND',
          message: 'Credential not found',
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: credential,
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error retrieving credential', { error: errorMessage, credentialId, requestId });

    res.status(500).json({
      status: 'error',
      error: {
        code: 'CREDENTIAL_RETRIEVAL_ERROR',
        message: 'Failed to retrieve credential',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// PUT /api/v1/credentials/:id - Update a credential
credentialsRouter.put('/:id', async (req: express.Request, res: express.Response) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  const credentialId = req.params.id;

  try {
    // Check if vault is unlocked
    if (!vaultService.isVaultUnlocked()) {
      logger.warn('Attempted to update credential while vault is locked', {
        credentialId,
        requestId,
      });
      return res.status(503).json({
        status: 'error',
        error: {
          code: 'VAULT_LOCKED',
          message: 'Vault is locked, cannot perform operation.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    // Extract updates from request body
    const { name, service, metadata, tags, status, expiresAt } = req.body;
    const updates: CredentialUpdateOptions = {
      name,
      service,
      metadata,
      tags,
      status,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    };

    // Basic validation: Ensure at least one field is being updated
    if (Object.values(updates).every(value => value === undefined)) {
      logger.warn('Attempted update with no fields specified', { credentialId, requestId });
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'INVALID_INPUT',
          message: 'No update fields provided.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    // Validate status if provided
    if (status && !Object.values(CredentialStatus).includes(status as CredentialStatus)) {
      logger.warn('Invalid status value provided for update', { credentialId, status, requestId });
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'INVALID_INPUT',
          message: `Invalid status value. Must be one of: ${Object.values(CredentialStatus).join(
            ', '
          )}.`,
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    logger.info('Updating credential', { credentialId, updates, requestId });

    const updatedCredential = await vaultService.updateCredential(credentialId, updates);

    // Handle not found case
    if (!updatedCredential) {
      logger.warn('Credential not found for update', { credentialId, requestId });
      return res.status(404).json({
        status: 'error',
        error: {
          code: 'CREDENTIAL_NOT_FOUND',
          message: 'Credential not found',
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedCredential,
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error updating credential', { error: errorMessage, credentialId, requestId });

    res.status(500).json({
      status: 'error',
      error: {
        code: 'CREDENTIAL_UPDATE_ERROR',
        message: 'Failed to update credential',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

// DELETE /api/v1/credentials/:id - Delete a credential
credentialsRouter.delete('/:id', async (req: express.Request, res: express.Response) => {
  const requestId = req.headers['x-request-id'] || 'unknown';
  const credentialId = req.params.id;

  try {
    // Check if vault is unlocked
    if (!vaultService.isVaultUnlocked()) {
      logger.warn('Attempted to delete credential while vault is locked', {
        credentialId,
        requestId,
      });
      return res.status(503).json({
        status: 'error',
        error: {
          code: 'VAULT_LOCKED',
          message: 'Vault is locked, cannot perform operation.',
        },
        metadata: { requestId, timestamp: new Date().toISOString() },
      });
    }

    logger.info('Deleting credential', { credentialId, requestId });

    const deleted = await vaultService.deleteCredential(credentialId);

    // Handle not found case
    if (!deleted) {
      logger.warn('Credential not found for deletion', { credentialId, requestId });
      return res.status(404).json({
        status: 'error',
        error: {
          code: 'CREDENTIAL_NOT_FOUND',
          message: 'Credential not found',
        },
        metadata: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: credentialId,
        deleted: true,
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    // Centralized error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error deleting credential', { error: errorMessage, credentialId, requestId });

    res.status(500).json({
      status: 'error',
      error: {
        code: 'CREDENTIAL_DELETION_ERROR',
        message: 'Failed to delete credential',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export { credentialsRouter };
