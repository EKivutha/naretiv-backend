# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:16

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /src/index

# Copies package.json and package-lock.json to Docker environment
COPY package*.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment
COPY . .

# Uses port which is used by the actual application
EXPOSE 3001

# Finally runs the application
CMD [ "npm", "start" ]