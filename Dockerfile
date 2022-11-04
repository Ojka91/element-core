FROM node:16-alpine

EXPOSE 3000

WORKDIR /app
COPY ./package.json ./
COPY tsconfig.json ./

RUN npm i pm2 -g
RUN npm i
COPY . .
RUN npm run build

CMD ["pm2-runtime", "./dist/app.js"]