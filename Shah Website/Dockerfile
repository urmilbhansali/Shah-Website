FROM node:18

WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

