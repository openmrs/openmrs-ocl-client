# syntax=docker/dockerfile:1

# Stage-1 Build process
# Use the official node:14 runtime image for the build environment and tag the build as build-deps
FROM node:14-alpine as build-deps

# Create a working directory for the build project
RUN mkdir -p /usr/src/app

# Navigate to the created directory
WORKDIR /usr/src/app

# Create an enviroment variable for the node_modules
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy the code to the docker image
ADD . /usr/src/app/

# Set environment to production
ENV NODE_ENV production

# Install the project dependencies
RUN npm ci

# Create an optimized build version of the project
RUN npm run build

# Stage-2 Production Environment
# Use the nginx 1.21-alpine runtime image for the production environment
FROM nginx:1.21-alpine

# Make port 80 available to the world outside the container
EXPOSE 80

# Copy the CI build number
ARG OCL_BUILD
ENV OCL_BUILD=$OCL_BUILD

# Clear the default nginx folder
RUN rm -rf /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html

# Copy the tagged files from the build to the production environmnet of the nginx server
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Copy nginx configuration
COPY --from=build-deps /usr/src/app/docker/default.conf /etc/nginx/conf.d/

# Copy shell script to container
COPY --from=build-deps /usr/src/app/docker/startup.sh .

# Make our shell script executable
RUN chmod +x startup.sh

# Set the environment variables actually used in the image
ENV OCL_API_HOST https://api.staging.openconceptlab.org/
ENV TRADITIONAL_OCL_HOST https://app.staging.openconceptlab.org/
ENV OCL_SIGNUP_URL https://app.staging.openconceptlab.org/#/accounts/signup

# Start the server
CMD sh startup.sh
