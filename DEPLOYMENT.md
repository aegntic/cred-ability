# CRED-ABILITY Deployment Guide

This document outlines the simplified deployment process for the CRED-ABILITY website.

## Overview

The CRED-ABILITY website can be deployed in two modes:

1. **Development Mode** - With hot-reloading for active development
2. **Production Mode** - Using Nginx for optimized performance

## Deployment Commands

We've simplified the deployment process with a single command-line script that handles all deployment scenarios.

### Starting the Website in Development Mode

```bash
./run-website.sh dev
```

This will:
- Start a Node.js container with the website code mounted
- Install all dependencies
- Set up the improved website version
- Start the development server with hot-reloading
- Make the site available at http://localhost:3000

### Starting the Website in Production Mode

```bash
./run-website.sh prod
```

This will:
- Build the production Docker image (if not already built)
- Start an Nginx container serving the optimized build
- Configure routing and caching for optimal performance
- Make the site available at http://localhost:8080

### Building Without Running

```bash
./run-website.sh build
```

### Stopping the Website

```bash
./run-website.sh stop
```

### Cleaning Up

```bash
./run-website.sh clean
```

## Configuration Files

All Docker configuration has been consolidated into a single file:

- `docker-compose.yml` - Contains both development and production services

## Integration with Other Services

The website can be integrated with backend services by ensuring they all use the `cred-ability-network` Docker network.

## Troubleshooting

### Container Logs

To view logs from the running containers:

```bash
# Development mode
docker logs -f cred-ability-website-dev

# Production mode
docker logs -f cred-ability-website
```

### Common Issues

1. **Port conflicts**: If ports 3000 or 8080 are already in use, edit the port mappings in `docker-compose.yml`

2. **Network issues**: If containers can't communicate, ensure the `cred-ability-network` network exists with `docker network ls`

3. **Build failures**: Check if you have enough disk space and that Docker has sufficient resources allocated