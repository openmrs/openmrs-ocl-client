#!/bin/bash

echo "Start the deploy.."
OCL_API_HOST="$1"
OCL_FRONTEND_IMG="$2"
echo "Stop the running container.."
docker stop ocl-frontend

echo "Remove the stopped container.."
docker rm ocl-frontend

echo "Run the latest docker.."
docker run --name=ocl-frontend --restart unless-stopped -d -p 80:80 -e OCL_API_HOST=${OCL_API_HOST} ${OCL_FRONTEND_IMG}:latest

echo "Cleanup..."
docker system prune -a -f
