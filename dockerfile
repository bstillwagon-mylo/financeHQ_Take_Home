FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other necessary build tools
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Copy the rest of the application
COPY . .

# Don't generate Prisma Client here - we'll do it in the entrypoint
# Don't build here - we'll do it in the entrypoint for development mode

EXPOSE 4000

# Use an entrypoint script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]