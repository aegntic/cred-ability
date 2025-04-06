# CRED-ABILITY

A comprehensive credential management system designed to transform how digital credentials are detected, managed, and secured with intelligent context analysis.

## Project Overview

CRED-ABILITY is a modular, security-first credential management system with four primary components:

1. **Browser Integration Engine**: Detect and capture credentials in web applications
2. **Model Context Protocol (MCP) Server**: Process credential events and coordinate between components
3. **Credential Vault**: Securely store and manage encrypted credentials
4. **Intelligence Layer**: Analyze context and generate security recommendations

## Current Status

The project is currently in the Foundation phase with core components implemented and documented. See [Technical Summary](./docs/TECHNICAL_SUMMARY.md) for detailed information.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later)
- Docker and Docker Compose
- Git

### Setup

1. Clone the repository

```bash
git clone https://github.com/aegntic/cred-ability.git
cd cred-ability
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.development` file in the project root.

4. Start the development environment

```bash
docker-compose -f docker-compose.dev.yml up -d
npm run dev
```

## Documentation

- [Planning](./docs/PLANNING.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [API Specifications](./docs/API_SPEC.md)
- [Security Protocol](./docs/SECURITY_PROTOCOL.md)
- [Developer Guide](./docs/DEV_GUIDE.md)

## License

[MIT](LICENSE)
