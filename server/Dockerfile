FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV MONGODB_URI="mongodb://host.docker.internal:27017/analytics"

CMD [ "node", "server.js" ]
