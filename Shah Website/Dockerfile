FROM node:18

# Set working directory
WORKDIR /app

# List files in build context (debug)
RUN ls -la / || echo "Root directory listing"

# Copy package files explicitly
COPY package.json ./
COPY package-lock.json ./

# Verify package.json exists
RUN ls -la && cat package.json | head -5

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

