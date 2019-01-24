#Grab the latest node image
FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Expose port from container so host can access $PORT
EXPOSE $PORT

# Run the image as a non-root user
CMD [ "npm", "start" ]
