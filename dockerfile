# Init database for the first time.
FROM postgres:latest
COPY init.sql /docker-entrypoint-initdb.d/

# Check out https://hub.docker.com/_/node to select a new base image
FROM node:lts-alpine3.14

# Set to a non-root built-in user `node`
USER root

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies & setup.
COPY --chown=node package.json /home/node/app
RUN apk update && apk add --no-cache chromium
RUN yarn install

# Bundle app source code
COPY --chown=node . .