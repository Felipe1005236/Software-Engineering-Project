FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application and Prisma 
RUN npm run build

# Expose the application port
EXPOSE 80

# Command to run the application
CMD ["nginx", "-g", "daemon off;"]