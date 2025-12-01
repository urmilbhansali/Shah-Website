FROM node:18

WORKDIR /app

# Copy all files first (Railway build context)
COPY . .

# Install dependencies
RUN npm install

# Expose port (Railway will set PORT env var)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

