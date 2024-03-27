FROM node:16.20.0-alpine

RUN set -x \
  && apk update \
  && apk add g++ make git

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV APP_DIR /usr/src/app

ARG BUNDLE_GITHUB__COM
RUN git config --global url."https://$BUNDLE_GITHUB__COM@github.com/Talkdesk/".insteadOf "https://github.com/Talkdesk/"

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

ADD . ${APP_DIR}

RUN yarn install --frozen-lockfile
