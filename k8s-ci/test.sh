#!/bin/sh

set -xu


CREATE_RANDOM='cat /dev/urandom | LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8'
PROJECT_NAME=$(echo ${TALKDESK_CI_BUILD_NAME:-$(eval ${CREATE_RANDOM})} | LC_CTYPE=C tr "[:upper:]" "[:lower:]" | tr '.' '-' )
BUILD_TAG=${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}

echo "Building Docker image"
docker-compose --project-name ${PROJECT_NAME} build unit-tests
docker-compose --project-name ${PROJECT_NAME} run --name ${BUILD_TAG}_ut unit-tests

EXIT=$?

docker-compose --project-name "${PROJECT_NAME}" down --volumes

exit $EXIT
