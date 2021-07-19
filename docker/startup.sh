#!/bin/bash

ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "// Version: $(date -u)" > ${ENV_FILE}

[ -n "${TRADITIONAL_OCL_HOST}" ] && \
  echo "var TRADITIONAL_OCL_HOST = \"${TRADITIONAL_OCL_HOST}\";" >> ${ENV_FILE}
[ -n "${OCL_API_HOST}" ] && \
  echo "var OCL_API_HOST = \"${OCL_API_HOST}\";" >> ${ENV_FILE}
[ -n "${OCL_SIGNUP_URL}" ] && \
  echo "var OCL_SIGNUP_URL = \"${OCL_SIGNUP_URL}\";" >> ${ENV_FILE}
[ -n "${OCL_BUILD}" ] && \
  echo "var OCL_BUILD = \"${OCL_BUILD}\";" >> ${ENV_FILE}
# converts a space separated list of GA tokens into a JS array
if [ -n "${OCL_GA_TOKENS}" ]; then
  TOKEN_STRING=""
  for token in ${OCL_GA_TOKENS};
  do
    if [ -z "${TOKEN_STRING}" ]; then
      TOKEN_STRING="\"${token}\""
    else
      TOKEN_STRING="${TOKEN_STRING},\"${token}\""
    fi
  done
  echo "var OCL_GA_TOKENS = [${TOKEN_STRING}];" >> ${ENV_FILE}
fi

echo "Using env-config.js:"
cat ${ENV_FILE}
echo "----"

echo "Starting up the server..."
nginx -g "daemon off;"
