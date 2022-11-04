FROM node:16

EXPOSE 3000
ENV ENV=production

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

RUN npm i typescript pm2 -g
RUN npm i
COPY . .
RUN tsc


CMD ["pm2-runtime", "./dist/app.js"]