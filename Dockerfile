# Build Stage for Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production Stage for Backend + Serving Static Frontend
FROM node:18-alpine
WORKDIR /app/backend

# Copy backend dependencies and source
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend assets to backend's public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
