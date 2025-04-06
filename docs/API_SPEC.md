# CRED-ABILITY API Specifications

## Overview

This document defines the API specifications for the CRED-ABILITY system, focusing on the Model Context Protocol (MCP) Server that forms the backbone of the ecosystem.

## API Versioning

All API endpoints are versioned using the URL path prefix: `/api/v1/`

## Authentication

All API requests must include authentication using JWT tokens:

```
Authorization: Bearer {jwt_token}
```

## Common Response Format

```json
{
  "status": "success|error",
  "data": {}, // Response data for successful requests
  "error": {  // Only present for error responses
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional detailed error information
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

## Endpoints

### Credential Detection

#### POST /api/v1/detection/report

Report a detected credential from a client integration.

**Request Body:**

```json
{
  "source": "browser|ide|cli",
  "credential": {
    "type": "api_key|oauth_token|password|pat|ssh_key",
    "value": "encrypted_credential_value",
    "algorithm": "encryption_algorithm",
    "iv": "initialization_vector"
  },
  "context": {
    "url": "https://example.com/path",
    "domain": "example.com",
    "timestamp": "ISO-8601 timestamp",
    "application": "application_identifier",
    "metadata": {}
  },
  "confidence": 0.95
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "detectionId": "unique-detection-id",
    "classification": {
      "credentialType": "api_key",
      "service": "aws",
      "confidenceScore": 0.95,
      "riskLevel": "high"
    },
    "recommendations": [
      {
        "type": "rotation",
        "priority": "high",
        "description": "This AWS API key should be rotated immediately"
      },
      {
        "type": "scope_reduction",
        "priority": "medium",
        "description": "Consider limiting the permissions for this key"
      }
    ]
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### GET /api/v1/detection/{detectionId}

Retrieve information about a previously reported detection.

**Response:**

```json
{
  "status": "success",
  "data": {
    "detectionId": "unique-detection-id",
    "timestamp": "ISO-8601 timestamp",
    "source": "browser",
    "classification": {
      "credentialType": "api_key",
      "service": "aws",
      "confidenceScore": 0.95,
      "riskLevel": "high"
    },
    "status": "pending|resolved|ignored",
    "recommendations": []
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

### Credential Management

#### GET /api/v1/credentials

List managed credentials in the vault.

**Query Parameters:**
- `type`: Filter by credential type
- `service`: Filter by service
- `riskLevel`: Filter by risk level
- `status`: Filter by status
- `page`: Pagination page number
- `limit`: Results per page

**Response:**

```json
{
  "status": "success",
  "data": {
    "credentials": [
      {
        "id": "credential-id-1",
        "name": "AWS Production API Key",
        "type": "api_key",
        "service": "aws",
        "lastRotated": "ISO-8601 timestamp",
        "riskLevel": "high",
        "status": "active",
        "metadata": {}
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### POST /api/v1/credentials

Add a new credential to the vault.

**Request Body:**

```json
{
  "name": "AWS Production API Key",
  "type": "api_key",
  "service": "aws",
  "value": "encrypted_credential_value",
  "algorithm": "encryption_algorithm",
  "iv": "initialization_vector",
  "metadata": {
    "region": "us-west-2",
    "account": "production"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "new-credential-id",
    "name": "AWS Production API Key",
    "type": "api_key",
    "service": "aws",
    "created": "ISO-8601 timestamp",
    "status": "active"
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### GET /api/v1/credentials/{credentialId}

Retrieve a credential by ID.

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "credential-id",
    "name": "AWS Production API Key",
    "type": "api_key",
    "service": "aws",
    "lastRotated": "ISO-8601 timestamp",
    "riskLevel": "high",
    "status": "active",
    "metadata": {
      "region": "us-west-2",
      "account": "production"
    }
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### PUT /api/v1/credentials/{credentialId}

Update a credential.

**Request Body:**

```json
{
  "name": "Updated Key Name",
  "status": "deactivated",
  "metadata": {
    "region": "us-east-1",
    "account": "production"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "credential-id",
    "name": "Updated Key Name",
    "type": "api_key",
    "service": "aws",
    "lastRotated": "ISO-8601 timestamp",
    "riskLevel": "high",
    "status": "deactivated",
    "updated": "ISO-8601 timestamp"
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### DELETE /api/v1/credentials/{credentialId}

Delete a credential.

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "credential-id",
    "deleted": true
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

### Security Recommendations

#### GET /api/v1/recommendations

Get security recommendations for credentials.

**Query Parameters:**
- `credentialId`: Filter by credential ID
- `priority`: Filter by priority level
- `status`: Filter by recommendation status
- `page`: Pagination page number
- `limit`: Results per page

**Response:**

```json
{
  "status": "success",
  "data": {
    "recommendations": [
      {
        "id": "recommendation-id",
        "credentialId": "credential-id",
        "type": "rotation",
        "priority": "high",
        "description": "Rotate this key immediately due to excessive permissions",
        "status": "pending",
        "created": "ISO-8601 timestamp"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

#### PUT /api/v1/recommendations/{recommendationId}

Update the status of a recommendation.

**Request Body:**

```json
{
  "status": "implemented|ignored|pending",
  "notes": "Optional notes about the status change"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "recommendation-id",
    "status": "implemented",
    "updated": "ISO-8601 timestamp"
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

### Context Analysis

#### GET /api/v1/context/{credentialId}

Get contextual information for a credential.

**Response:**

```json
{
  "status": "success",
  "data": {
    "credentialId": "credential-id",
    "serviceMappings": [
      {
        "service": "aws",
        "confidence": 0.95,
        "details": {
          "region": "us-west-2",
          "serviceType": "ec2"
        }
      }
    ],
    "usagePatterns": [
      {
        "application": "CI/CD pipeline",
        "frequency": "daily",
        "lastUsed": "ISO-8601 timestamp"
      }
    ],
    "relatedCredentials": [
      {
        "id": "related-credential-id",
        "relationship": "same-service",
        "strengthScore": 0.8
      }
    ],
    "riskAssessment": {
      "overallScore": 0.75,
      "factors": [
        {
          "factor": "permission_scope",
          "score": 0.9,
          "details": "This key has admin-level permissions"
        },
        {
          "factor": "rotation_age",
          "score": 0.6,
          "details": "Key was last rotated 45 days ago"
        }
      ]
    }
  },
  "metadata": {
    "requestId": "unique-request-id",
    "timestamp": "ISO-8601 timestamp"
  }
}
```

### System Health and Monitoring

#### GET /api/v1/health

Check system health status.

**Response:**

```json
{
  "status": "success",
  "data": {
    "status": "healthy",
    "components": {
      "api": "healthy",
      "database": "healthy",
      "vault": "healthy",
      "intelligence": "healthy"
    },
    "metrics": {
      "responseTimes": {
        "p50": 45,
        "p95": 120,
        "p99": 180
      },
      "requestRate": 75.5,
      "errorRate": 0.02
    }
  },
  "metadata": {
    "timestamp": "ISO-8601 timestamp"
  }
}
```

## WebSocket API

In addition to the REST API, CRED-ABILITY provides a WebSocket API for real-time credential detection events.

### Connection

Connect to: `wss://api.cred-ability.example/api/v1/ws`

Authentication is required via a token query parameter: `?token={jwt_token}`

### Events

#### Detection Event

```json
{
  "event": "detection",
  "data": {
    "detectionId": "unique-detection-id",
    "timestamp": "ISO-8601 timestamp",
    "source": "browser",
    "classification": {
      "credentialType": "api_key",
      "service": "aws",
      "confidenceScore": 0.95,
      "riskLevel": "high"
    }
  }
}
```

#### Recommendation Event

```json
{
  "event": "recommendation",
  "data": {
    "recommendationId": "recommendation-id",
    "credentialId": "credential-id",
    "type": "rotation",
    "priority": "high",
    "description": "Rotate this key immediately due to excessive permissions"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication is required |
| `INVALID_TOKEN` | Invalid or expired token |
| `PERMISSION_DENIED` | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | The requested resource was not found |
| `INVALID_REQUEST` | The request is invalid or malformed |
| `DUPLICATE_RESOURCE` | The resource already exists |
| `ENCRYPTION_ERROR` | Error in encryption/decryption process |
| `VAULT_ERROR` | Error in credential vault operation |
| `INTELLIGENCE_ERROR` | Error in intelligence layer operation |
| `INTERNAL_ERROR` | Internal server error |
