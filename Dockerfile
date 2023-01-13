FROM node:15

WORKDIR /var/app

RUN npm install

COPY . .

CMD ["yarn", "start"]