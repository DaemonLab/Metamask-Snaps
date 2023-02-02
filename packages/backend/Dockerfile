FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev

# Bundle app source
COPY . .
COPY .env env

SHELL ["/bin/bash", "-c", "source", "env"] 

EXPOSE $SERVER_PORT

CMD [ "npm", "run", "build" ]