#!/bin/bash
echo "Holy Start..."
REPO_LOCATION="$1"
OCL_FRONTEND_IMG="$2"
export PATH=/usr/local/bin:$PATH
echo $PATH
export BUILD_TIME=$(date +"%Y-%m-%d-%H-%M-%S")
echo "Build time - $BUILD_TIME"
echo "Docker build.."
docker build --no-cache -t ocl-frontend:latest .
docker tag ocl-frontend:latest ${OCL_FRONTEND_IMG}:latest
docker tag ocl-frontend:latest ${OCL_FRONTEND_IMG}:$BUILD_TIME
echo "aws ecr login .."
aws ecr get-login-password --region ap-south-1|docker login --username AWS --password-stdin ${REPO_LOCATION}
echo "Docker push to ECR.."
docker push ${OCL_FRONTEND_IMG}:latest
docker push ${OCL_FRONTEND_IMG}:$BUILD_TIME
echo "Done..."
