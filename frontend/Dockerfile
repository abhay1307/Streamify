# Use the latest Node.js LTS image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable to force React to use polling (useful in Docker)
ENV CHOKIDAR_USEPOLLING=true

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
