# Production Dockerfile for TypeScript Vapi Application
# Version 2.0.2 - Fixed for Railway

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy ALL application files
COPY . .

# List files to verify (for debugging)
RUN echo "Files in /app:" && ls -la && \
    echo "Checking src directory:" && ls -la src/ || echo "src not found"

# Build the TypeScript application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Copy static HTML files
COPY *.html ./

# Copy configuration files
COPY railway.json ./

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3002

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Run the server
CMD ["node", "dist/server.js"]