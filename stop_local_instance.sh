#!/bin/sh

echo "Stopping App..."
docker-compose down -v --remove-orphans || exit 1

if [ -d oclapi ]; then 
  echo "Stopping API..."
  pushd oclapi
  pushd oclapi >/dev/null
  docker-compose down -v --remove-orphans || exit 1
  popd >/dev/null
fi
