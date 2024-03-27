#!/bin/bash
set -exu

PACKAGE_NAME=$1

echo "Publishing NPM ${PACKAGE_NAME}"

NPM_CREDENTIALS="registry=${REGISTRY_NPM_PUSH}\n _auth=${REGISTRY_CREDENTIALS_BASE64}\n email=${REGISTRY_EMAIL}"

docker build --build-arg BUNDLE_GITHUB__COM=${BUNDLE_GITHUB__COM} --tag ${BUILD_TAG} .

docker run --rm ${BUILD_TAG} \
    sh -c "printf '${NPM_CREDENTIALS}' > /root/.npmrc &&
    printf '\nunsafe-perm=true' >> /root/.npmrc &&
    yarn publish:${PACKAGE_NAME} --registry=${REGISTRY_NPM_PUSH}"