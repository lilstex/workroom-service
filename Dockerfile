FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install --omit=dev

USER node

CMD [ "node", "src/app" ]

EXPOSE 2002