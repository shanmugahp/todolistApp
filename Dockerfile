FROM node:16.5.0-alpine
WORKDIR /app
CMD ls -ltr && npm install && npm start