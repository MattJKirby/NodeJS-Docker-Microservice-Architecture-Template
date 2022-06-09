FROM node:latest as base

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN  npm install

# Bundle app source
COPY . .

EXPOSE 8001

CMD [ "npm", "run", "start:live" ]