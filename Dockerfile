FROM node:lts-alpine3.15

WORKDIR /app

RUN apk add ffmpeg

COPY package.json .

RUN npm i

COPY . .

CMD [ "npm", "start" ]