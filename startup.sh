#!/bin/bash

ENV_FILE="/usr/share/nginx/html/env-config.js"

echo "// Version: $(date -u)" > ${ENV_FILE}

if [[ ! -z "${TRADITIONAL_OCL_HOST}" ]]; then
    echo "var TRADITIONAL_OCL_HOST = \"${TRADITIONAL_OCL_HOST}\";" >> ${ENV_FILE}
fi
if [[ ! -z "${OCL_API_HOST}" ]]; then
    echo "var OCL_API_HOST = \"${OCL_API_HOST}\";" >> ${ENV_FILE}
fi

echo "Using env-config.js:"
cat ${ENV_FILE}
echo "----"

echo "Starting up the server..."
nginx -g "daemon off;"
