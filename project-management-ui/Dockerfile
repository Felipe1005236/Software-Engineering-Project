# First stage: Build React App
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Second stage: Serve with Nginx
FROM nginx:alpine

# Copy the built frontend from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom Nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
