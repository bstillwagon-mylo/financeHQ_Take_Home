# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Run tests
RUN npm test

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]