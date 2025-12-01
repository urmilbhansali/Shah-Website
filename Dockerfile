FROM node:18

# Set working directory
WORKDIR /app

# Copy package files from subdirectory (use JSON array syntax for paths with spaces)
COPY ["Shah Website/package.json", "./"]
COPY ["Shah Website/package-lock.json", "./"]

# Install dependencies
RUN npm install

# Copy all other files from subdirectory (use JSON array syntax for paths with spaces)
COPY ["Shah Website/", "./"]

# Expose port (Railway will set PORT env var)
# Railway handles port mapping automatically
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

