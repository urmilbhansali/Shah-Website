FROM node:18

WORKDIR /app

# Copy package files explicitly first
COPY package.json ./
COPY package-lock.json* ./

# Verify package.json exists (debug)
RUN ls -la /app/ && cat package.json | head -3

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

