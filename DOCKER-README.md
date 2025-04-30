# CRED-ABILITY Dockerized Website

## Overview

This repository includes Docker configuration for running the CRED-ABILITY website in both development and production environments. Docker containers provide consistent environments and simplify deployment across different platforms.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Directory Structure

```
/
├── docker-compose.yml           # Main Docker Compose file
├── docker-compose.website.yml   # Website-specific Docker Compose file
├── docker-compose.dev.yml       # Development services (PostgreSQL, Redis, etc.)
├── run-website.sh               # Helper script for running the website
└── website/                     # Website source code
    ├── Dockerfile               # Website Dockerfile
    └── nginx.conf               # Nginx configuration for production
```

## Getting Started

### Development Mode

To run the website in development mode with hot-reloading:

```bash
./run-website.sh dev
```

This will:
1. Create a Docker container with Node.js
2. Mount the website source code into the container
3. Install dependencies
4. Set up the improved website version
5. Start the development server with hot-reloading

The website will be available at http://localhost:3000

### Production Mode

To run the website in production mode using Nginx:

```bash
./run-website.sh prod
```

This will:
1. Build the production Docker image (if not already built)
2. Start an Nginx container serving the optimized build
3. Configure routing and caching for optimal performance

The website will be available at http://localhost:8080

### Building Without Running

To just build the production Docker image without running it:

```bash
./run-website.sh build
```

### Stopping Containers

To stop the running website containers:

```bash
./run-website.sh stop
```

### Cleaning Up

To stop and remove all website containers, networks, and images:

```bash
./run-website.sh clean
```

## Integration with Backend Services

The website can be integrated with the existing development services by running:

```bash
# Start database and other development services
docker-compose -f docker-compose.dev.yml up -d

# Start the website
./run-website.sh dev  # or prod for production mode
```

## Customization

### Environment Variables

You can customize the website by setting environment variables in the Docker Compose files.

### Nginx Configuration

The production Nginx configuration can be customized by editing the `website/nginx.conf` file before building the production image.

## Troubleshooting

### Container Logs

To view logs from the running containers:

```bash
# Development mode
docker logs -f cred-ability-website-dev

# Production mode
docker logs -f cred-ability-website-prod
```

### Common Issues

1. **Port conflicts**: If ports 3000 or 8080 are already in use, edit the port mappings in `docker-compose.website.yml`

2. **Network issues**: If containers can't communicate, ensure the `cred-ability-network` network exists with `docker network ls`

3. **Build failures**: Check if you have enough disk space and that Docker has sufficient resources allocated

## Security Considerations

- The production image is multi-stage and minimal, reducing attack surface
- Static files are served by Nginx with proper cache headers
- No source code is included in the production image, only built assets