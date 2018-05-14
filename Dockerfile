# Stage-1 Build process
# Use the official node:7.10 runtime image for the build environment and tag the build as build-deps
FROM node:7.10 as build-deps

# Create a workking directory for the build project
WORKDIR /urs/src/app

# Copy the package.json and the package-lock.json to the working directory
COPY package.json package-lock.json ./

# Create an optimized build version of the project
RUN npm build

# Stage-2 Production Environment
# Use the nginx 1.12-alpine runtime image for the production environment
FROM nginx:1.12-alpine

# Copy the tagged files from the build to the production environmnet of the nginx server
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Make port 80 available to the world outside the container
EXPOSE 80

# Run the nginx server
CMD ["nginx", "-g", "daemon off;"]
