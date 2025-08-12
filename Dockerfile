# Build stage for client
FROM node:18-alpine AS client-builder

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app/client

# Copy package files
COPY client/package.json ./

# Install dependencies
RUN npm install

# Copy client source
COPY client/ ./

# Build client
RUN npm run build

# Production stage
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy environment file
COPY .env ./

# Copy client build from previous stage
COPY --from=client-builder /app/client/dist ./client/dist

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chmod 755 uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]