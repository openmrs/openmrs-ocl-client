#!/bin/sh

echo "Starting API..."
if [ ! -d oclapi ]; then
  git clone https://github.com/OpenConceptLab/oclapi.git
elif [ -d oclapi/.git ]; then
  git --git-dir=oclapi/.git --work-tree=oclapi pull --ff-only --rebase --autostash
else
  echo "Directory oclapi does not seem to be a valid git repository"
  echo "Please remove the oclapi directory"
  exit 1
fi

[ $? -ne 0 ] && exit 1
pushd oclapi >/dev/null 2>&1 || exit 1
docker-compose build || exit $?
docker-compose up -d || exit $?
api_endpoint=http://localhost:8000
popd >/dev/null 2>&1 || exit 1

echo "Building App..."
export OCL_API_HOST=$api_endpoint
docker-compose build --build-arg OCL_BUILD=$(git rev-parse --short HEAD) || exit $?
echo "Starting App..."
docker-compose up -d || exit $?
app_endpoint=http://localhost:8080

# wait for the api and app to be live
./wait_for_url.sh $api_endpoint"/sources" || exit $?
echo "API listening at "$api_endpoint

./wait_for_url.sh $app_endpoint || exit $?
echo "App listening at "$app_endpoint
