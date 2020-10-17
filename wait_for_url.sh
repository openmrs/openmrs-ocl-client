#!/bin/sh

curl -V > /dev/null
if [ $? -ne 0 ]; then
  echo "./wait_for_url.sh requires curl to be installed"
  exit 1
fi

if [ -n "$1" ]; then
  url=$1
else
  echo "Usage: ./wait_for_url.sh url [max_attempts]"
  exit 1
fi

if [ -n "$2" ]; then
  max_attempts=$2
else
  max_attempts=5
fi

if [ -z "$max_attempts" -o $max_attempts -lt 1 ]; then
  max_attempts=5
fi

echo "Waiting for $1"

attempt_counter=1
until $(curl --output /dev/null --silent --head --fail $url); do
  if [ ${attempt_counter} -eq ${max_attempts} ];then
    echo "Max attempts reached"
    exit 1
  fi
  printf "."
  attempt_counter=$(expr $attempt_counter + 1)
done
