FROM node:16-alpine

# Create app directory
WORKDIR /nestjs

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]