#!/bin/sh

echo "Starting API..."
git clone https://github.com/OpenConceptLab/oclapi.git
cd oclapi || exit
docker-compose build
docker-compose up -d
api_endpoint=http://localhost:8000
cd ..
bash ./wait_for_url.sh $api_endpoint"/sources"
echo "API listening at "$api_endpoint

echo "Starting App..."
export OCL_API_HOST='http://localhost:8000'
docker-compose build
docker-compose up -d
app_endpoint=http://localhost:8080
bash ./wait_for_url.sh $app_endpoint
echo "App listening at "$app_endpoint
