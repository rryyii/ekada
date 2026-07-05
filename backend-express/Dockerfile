FROM node:22.19.0

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["node", "app.js"]