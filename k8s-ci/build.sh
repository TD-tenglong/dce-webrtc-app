#!/bin/sh

set -exu

CREATE_RANDOM='cat /dev/urandom |  LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8'
PROJECT_NAME=$(echo ${TALKDESK_CI_BUILD_NAME:-$(eval ${CREATE_RANDOM})} | LC_CTYPE=C tr "[:upper:]" "[:lower:]" | tr '.' '-' | tr '@' '-')
RELEASE_STAGE=$1
BUILD_TAG="${TALKDESK_CI_BUILD_TASK:-$(eval ${CREATE_RANDOM})}-${RELEASE_STAGE}"



echo "Building Docker image"
docker-compose --project-name ${PROJECT_NAME} build build_${RELEASE_STAGE}
docker-compose --project-name ${PROJECT_NAME} run --name ${BUILD_TAG} -e GIT_COMMIT=${RELEASE_TAG} build_${RELEASE_STAGE}

echo "Moving assets into ${OUTPUT_PATH_ARTIFACTS}"
mkdir -p ${OUTPUT_PATH_ARTIFACTS}
CONTAINER_ID=$(docker ps -aqf "name=^/${BUILD_TAG}$")
[ ! -z "${CONTAINER_ID}" ] && docker cp ${CONTAINER_ID}:/usr/src/app/app/build/. ${OUTPUT_PATH_ARTIFACTS}/${RELEASE_STAGE}

EXIT=$?

docker-compose --project-name "${PROJECT_NAME}" down --volumes

exit $EXIT
