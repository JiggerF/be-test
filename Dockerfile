# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on (if applicable)
EXPOSE 3000

# Set environment variables for integration testing
ENV NODE_ENV=test
ENV AWS_REGION=us-east-1
ENV DYNAMODB_ENDPOINT=http://dynamodb-local:8000

# Command to create the table
CMD ["/bin/sh", "-c", ""]