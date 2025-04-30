#!/bin/bash

# Script to run the CRED-ABILITY website in Docker containers

set -e

show_help() {
    echo "CRED-ABILITY Website Runner"
    echo ""
    echo "Usage: ./run-website.sh [option]"
    echo ""
    echo "Options:"
    echo "  dev         Run the website in development mode with hot-reloading"
    echo "  prod        Run the website in production mode using Nginx"
    echo "  build       Build the production Docker image without running it"
    echo "  stop        Stop running containers"
    echo "  clean       Stop and remove containers, networks, and images"
    echo "  help        Show this help message"
    echo ""
}

check_network() {
    # Check if the network exists, if not create it
    if ! docker network inspect cred-ability-network &>/dev/null; then
        echo "Creating cred-ability-network..."
        docker network create cred-ability-network
    fi
}

case "$1" in
    dev)
        check_network
        echo "Starting website in development mode..."
        docker compose up website-dev
        ;;
    prod)
        check_network
        echo "Starting website in production mode..."
        docker compose up -d website
        echo "Website is running at http://localhost:8080"
        ;;
    build)
        echo "Building production Docker image..."
        docker compose build website
        echo "Build complete. Run './run-website.sh prod' to start the website."
        ;;
    stop)
        echo "Stopping website containers..."
        docker compose down
        echo "Website containers stopped."
        ;;
    clean)
        echo "Cleaning up website containers, networks, and images..."
        docker compose down --rmi all
        echo "Cleanup complete."
        ;;
    *)
        show_help
        ;;
esac