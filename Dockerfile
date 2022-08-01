# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:16-alpine

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app
# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./
USER node
# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY --chown=node:node . .

# Uses port which is used by the actual application
EXPOSE 8000

# Finally runs the application
CMD [ "yarn", "start" ]