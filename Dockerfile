FROM node:16-alpine

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

# RUN chmod +x scripts/deploy_aws_ecs.sh
# CMD ["bash", "-c", "scripts/deploy_aws_ecs.sh"]
# CMD ["npm start", "dist/app.js"]
# docker build -t api-service .
# docker run -it -p 80:80 api-service