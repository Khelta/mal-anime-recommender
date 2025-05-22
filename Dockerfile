FROM ghcr.io/puppeteer/puppeteer:latest

USER root 

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/dist && chown -R pptruser:pptruser /app

USER pptruser 

ENV HOST_URL=http://localhost:3000/

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
