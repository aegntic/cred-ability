# CRED-ABILITY Developer Guide

## Introduction

Welcome to the CRED-ABILITY developer guide. This document provides essential information for developers working on the CRED-ABILITY credential management system, including setup instructions, development practices, and architectural guidelines.

## Getting Started

### Prerequisites

Before beginning development, ensure you have the following installed:

- Node.js (v16 or later)
- npm (v8 or later)
- Docker and Docker Compose
- Git

### Environment Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/cred-ability.git
cd cred-ability
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.development` file in the project root with the following variables:

```
# Development environment variables
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=credability_dev
DB_USER=dev_user
DB_PASSWORD=dev_password

# Encryption settings
ENCRYPTION_KEY_ROTATION_DAYS=30
ARGON2_MEMORY=65536
ARGON2_ITERATIONS=3
ARGON2_PARALLELISM=4

# JWT settings
JWT_SECRET=dev_jwt_secret_should_be_changed_in_production
JWT_EXPIRATION=1h
```

> ⚠️ **Note:** Never commit `.env` files to the repository. The above is for local development only.

4. **Start the development environment:**

```bash
docker-compose -f docker-compose.dev.yml up -d
npm run dev
```

## Project Structure

The CRED-ABILITY project follows a modular, component-based architecture:

```
project/
├── docs/                 # Project documentation
├── src/                  # Source code
│   ├── browser-integration/  # Browser extension code
│   ├── mcp-server/           # Model Context Protocol server
│   ├── credential-vault/     # Secure credential storage
│   ├── intelligence-layer/   # Analysis and recommendations
│   ├── common/               # Shared utilities and types
│   └── api/                  # API endpoints
├── tests/                # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── scripts/              # Utility scripts
├── config/               # Configuration files
└── docker/               # Docker configurations
```

### Key Modules

1. **Browser Integration Engine**
   - Credential detection patterns
   - Page content analysis
   - Context capture
   - Network monitoring

2. **MCP Server**
   - Central event processing
   - Communication coordination
   - Protocol implementation
   - Credential classification

3. **Credential Vault**
   - Secure storage
   - Encryption/decryption
   - Access control
   - Key management

4. **Intelligence Layer**
   - Context analysis
   - Risk assessment
   - Recommendation generation
   - Service mapping

## Development Workflow

### Creating a New Feature

1. **Branch Creation**
   
   Create a new feature branch from `develop`:
   
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. **Implementation Steps**
   
   a. Define interfaces first
   b. Implement unit tests
   c. Implement the feature
   d. Document the code
   e. Ensure all tests pass

3. **Code Review**
   
   Create a pull request to `develop` and request reviews.

4. **Merge Process**
   
   Once approved, squash and merge your PR to maintain a clean history.

### Testing Strategy

#### Unit Testing

- Use Jest for unit testing
- Aim for >90% code coverage
- Test both success and failure paths
- Mock external dependencies

Example unit test:

```typescript
describe('CredentialDetector', () => {
  it('should detect API keys with high confidence', () => {
    // Arrange
    const detector = new CredentialDetector();
    const content = 'api_key="abcd1234efgh5678"';
    
    // Act
    const result = detector.detect(content);
    
    // Assert
    expect(result.credentials).toHaveLength(1);
    expect(result.credentials[0].type).toBe('api_key');
    expect(result.credentials[0].confidence).toBeGreaterThan(0.8);
  });
});
```

#### Integration Testing

Integration tests validate component interactions:

```typescript
describe('MCP Server and Intelligence Layer integration', () => {
  it('should classify credentials and generate recommendations', async () => {
    // Arrange
    const mcpServer = new MCPServer();
    const event = createTestEvent('api_key', 'test_value');
    
    // Act
    const result = await mcpServer.process_credential_event(event);
    
    // Assert
    expect(result.classification).toBeDefined();
    expect(result.recommendations).toHaveLength.greaterThan(0);
  });
});
```

#### End-to-End Testing

E2E tests validate complete user flows:

```typescript
describe('Credential capture to recommendation flow', () => {
  it('should detect, classify, and recommend actions for credentials', async () => {
    // Arrange
    const browser = await launchBrowser();
    const page = await browser.newPage();
    
    // Act
    await page.goto('https://test-site.example/with-credentials');
    const extensionOutput = await getExtensionEvents();
    
    // Assert
    expect(extensionOutput.detections).toHaveLength.greaterThan(0);
    expect(extensionOutput.recommendations).toBeDefined();
  });
});
```

### Coding Standards

#### TypeScript Guidelines

- Use strict mode with all strict type checking options enabled
- Define interfaces for all public APIs
- Use type guards for runtime type checking
- Prefer readonly properties when possible
- Use enums for finite sets of related constants
- Always specify return types for functions

Example:

```typescript
interface CredentialDetectionResult {
  readonly credentials: DetectedCredential[];
  readonly confidence: number;
}

enum CredentialType {
  API_KEY = 'api_key',
  OAUTH_TOKEN = 'oauth_token',
  PASSWORD = 'password',
  PAT = 'personal_access_token'
}

function detectCredentials(content: string): CredentialDetectionResult {
  // Implementation...
}
```

#### Security Best Practices

1. **Input Validation**
   - Validate all input data
   - Use schema validation for API payloads
   - Sanitize data before processing

2. **Credential Handling**
   - Never log credentials, even in debug mode
   - Use secure memory handling for secrets
   - Implement credential masking in logs

3. **Error Handling**
   - Never expose sensitive information in errors
   - Implement consistent error handling
   - Use appropriate error types

Example secure credential handling:

```typescript
function processCredential(credential: string): void {
  try {
    // Mask credential in logs
    logger.debug(`Processing credential: ${maskCredential(credential)}`);
    
    // Process in a secure way
    const result = secureCredentialOperation(credential);
    
    // Zero out the credential after use
    zeroize(credential);
    
    return result;
  } catch (error) {
    // Log without exposing the credential
    logger.error('Error processing credential', { error });
    throw new CredentialOperationError('Failed to process credential');
  }
}
```

## API Standards

### RESTful API Design

1. **Resource Naming**
   - Use plural nouns for resources
   - Use lowercase with hyphens for multiple words
   - Nest resources to show relationships

2. **HTTP Methods**
   - GET: Retrieve resources
   - POST: Create new resources
   - PUT: Update resources (complete replacement)
   - PATCH: Partial resource updates
   - DELETE: Remove resources

3. **Status Codes**
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

### API Documentation

All APIs must be documented using OpenAPI (Swagger) specification:

```yaml
openapi: 3.0.0
info:
  title: CRED-ABILITY API
  version: 1.0.0
  description: Credential management system API
paths:
  /api/v1/detections:
    post:
      summary: Report a credential detection
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DetectionRequest'
      responses:
        '201':
          description: Detection recorded successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DetectionResponse'
components:
  schemas:
    DetectionRequest:
      type: object
      required:
        - source
        - credential
      properties:
        source:
          type: string
          enum: [browser, ide, cli]
```

## Extension Development

### Browser Extension Structure

```
browser-integration/
├── manifest.json      # Extension configuration
├── background/        # Background scripts
├── content/           # Content scripts
├── popup/             # UI components
└── lib/               # Shared libraries
```

### Extension Development Workflow

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. Load the unpacked extension in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked" and select the `dist/extension` directory

3. Test the extension:
   - Navigate to test pages
   - Use the extension popup
   - Monitor background script logs in the extension page

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify that the Docker containers are running
   - Check database credentials in `.env` file
   - Ensure database migrations have been applied

2. **Encryption Key Issues**
   - Key rotation failures may occur if the storage service is unavailable
   - Verify encryption key settings in configuration
   - Check key derivation parameters

3. **Browser Extension Debugging**
   - Use browser developer tools for content script debugging
   - Check the extension background page console for errors
   - Monitor network requests for API communication issues

### Logging

CRED-ABILITY uses structured logging with the following levels:

- ERROR: Critical failures requiring immediate attention
- WARN: Potential issues that don't prevent operation
- INFO: Important operations and state changes
- DEBUG: Detailed debugging information
- TRACE: Very detailed execution flow (development only)

Example of proper logging:

```typescript
// Do this:
logger.info('Credential detected', { 
  source: 'browser',
  type: credential.type,
  confidence: credential.confidence
});

// Don't do this:
console.log(`Detected ${credential.type} with value ${credential.value}`);
```

## Performance Considerations

### Optimization Guidelines

1. **Browser Extension Performance**
   - Minimize DOM operations
   - Use efficient selectors
   - Implement detection throttling
   - Lazy-load extension features

2. **API Optimization**
   - Implement pagination for large result sets
   - Support field filtering to reduce payload size
   - Use caching for frequently accessed data
   - Implement request batching for bulk operations

3. **Encryption Performance**
   - Use hardware acceleration when available
   - Implement key caching (securely)
   - Optimize key derivation parameters based on environment

## Contributing

### Contribution Guidelines

1. **Code Contributions**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation
   - Keep pull requests focused on a single feature/fix

2. **Documentation Contributions**
   - Follow the documentation structure
   - Use clear, concise language
   - Include examples where appropriate
   - Update related documentation when changing features

3. **Issue Reporting**
   - Provide detailed reproduction steps
   - Include environment information
   - Attach relevant logs
   - Suggest potential solutions if possible

### Code Review Process

Code reviews should focus on:

1. Functionality: Does the code work as expected?
2. Architecture: Does the design follow project patterns?
3. Performance: Are there any obvious performance issues?
4. Security: Does the code follow security best practices?
5. Maintainability: Is the code clear and well-documented?
6. Testing: Are there sufficient tests for the changes?

## Further Resources

- [API Documentation](./API_SPEC.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Security Protocol](./SECURITY_PROTOCOL.md)
- [Planning Documentation](./PLANNING.md)
- [Task Tracking](./TASK.md)
