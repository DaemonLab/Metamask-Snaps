FROM node:19
RUN apt-get update -y && apt-get install -y openjdk-11-jre

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE $PORT

CMD [ "npm", "run", "build" ]
