FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /plump/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]