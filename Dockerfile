FROM node:18

# Set working directory
WORKDIR /app

# Copy package files from subdirectory (handle space in directory name)
COPY Shah\ Website/package.json ./
COPY Shah\ Website/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all other files from subdirectory
COPY Shah\ Website/ ./

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

