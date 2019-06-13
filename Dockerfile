FROM node:8.16.0-alpine

ENV APP /app
WORKDIR $APP

RUN npm install yarn -g

COPY package.json $APP
COPY yarn.lock $APP
RUN yarn

COPY . .
