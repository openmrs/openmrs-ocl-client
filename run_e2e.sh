#!/bin/bash

# Script to run the e2e tests in a Dockerised environment
docker container inspect odm-cypress 2>/dev/null 1>&2
result=$?
if [[ $result -ne 0 ]]; then
    docker rm odm-cypress 2>/dev/null 1>&2
fi

docker run -it --rm --name odm-cypress --network=host -v "$PWD:/e2e" -w /e2e cypress/included:7.5.0 $*
