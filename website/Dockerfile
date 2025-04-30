# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
# Use environment variables to control which version to build (standard or improved)
ARG USE_IMPROVED=true
RUN if [ "$USE_IMPROVED" = "true" ]; then \
        echo "Building improved version..." && \
        cp improved-index.html index.html && \
        cp improved-vite.config.ts vite.config.ts && \
        cp improved-tailwind.config.js tailwind.config.js && \
        sed -i "s/import App from '[\.\/]*App'/import App from '.\/improved-app'/" src/main.tsx && \
        sed -i "s/import '[\.\/]*index.css'/import '.\/improved-index.css'/" src/main.tsx; \
    else \
        echo "Building standard version..."; \
    fi

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]