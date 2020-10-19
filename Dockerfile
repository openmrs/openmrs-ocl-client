# Stage-1 Build process
# Use the official node:12.19 runtime image for the build environment and tag the build as build-deps
FROM node:12.19-alpine as build-deps

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
RUN npm install

# Create an optimized build version of the project
RUN npm run build

# Stage-2 Production Environment
# Use the nginx 1.19-alpine runtime image for the production environment
FROM nginx:1.19-alpine

# Make port 80 available to the world outside the container
EXPOSE 80

# Copy the tagged files from the build to the production environmnet of the nginx server
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Copy nginx configuration
COPY --from=build-deps /usr/src/app/docker/default.conf /etc/nginx/conf.d/

# Copy shell script to container
COPY ./startup.sh .

# Make our shell script executable
RUN chmod +x startup.sh

# Start the server
CMD sh startup.sh
