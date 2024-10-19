## CONTAINER COMMANDS
# Build and run backend service and redis locally. !! keep in mind --build flag will build re-build the images each time
run:
	docker-compose up

run-build:
	docker-compose up --build

# Build and run the dev docker image !! Wont connect to redis. Development only
docker-run:	
	docker build -t element-backend . && docker run --env-file='.env-dev' -p 3000:3000 element-backend

# Deploys fresh container
.ONESHELL:
deploy:
	docker-compose stop
	docker-compose build --no-cache
	docker-compose up

## LOCAL COMMANDS
# Use build to install required packages for running locally ("sudo" required!!)
build:
	npm install typescript -g && npm i -g dotenv-cli &&	npm install


test:
	npm run test

lint:
	npm run lint

format:
	npm run lint:fix