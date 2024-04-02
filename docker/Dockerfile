FROM node:20.11.1-slim

RUN apt-get update && apt-get install -y procps curl

COPY . /app

WORKDIR /app

RUN npm install

RUN npm run build

CMD [ "npm", "run", "watch:all" ]