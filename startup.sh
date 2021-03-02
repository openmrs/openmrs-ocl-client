#!/bin/bash

ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "// Version: $(date -u)" > ${ENV_FILE}

[ -n "${TRADITIONAL_OCL_HOST}" ] && \
  echo "var TRADITIONAL_OCL_HOST = \"${TRADITIONAL_OCL_HOST}\";" >> ${ENV_FILE}
[ -n "${OCL_API_HOST}" ] && \
  echo "var OCL_API_HOST = \"${OCL_API_HOST}\";" >> ${ENV_FILE}
[ -n "${OCL_SIGNUP_URL}" ] && \
  echo "var OCL_SIGNUP_URL = \"${OCL_SIGNUP_URL}\";" >> ${ENV_FILE}

echo "Using env-config.js:"
cat ${ENV_FILE}
echo "----"

echo "Starting up the server..."
nginx -g "daemon off;"
