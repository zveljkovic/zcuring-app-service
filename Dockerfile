FROM node:lts
EXPOSE 3000

ENV NODE_ENV production

WORKDIR /home/app
COPY . .
RUN npm ci

CMD [ "node", "index.js" ]
