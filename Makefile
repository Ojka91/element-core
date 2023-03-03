## CONTAINER COMMANDS
# Build and run backend service and redis locally. !! keep in mind --build flag will build re-build the images each time
run:
	docker-compose up --build

# Build and run the dev docker image !! Wont connect to redis. Development only
docker-run:	
	docker build -t element-backend . && docker run --env-file='.env-dev' -p 3000:3000 element-backend


## LOCAL COMMANDS
# Use build to install required packages for running locally ("sudo" required!!)
build:
	npm install typescript -g && npm i -g dotenv-cli &&	npm install

# Run locally dev using npm
run:
	npm run start

test:
	npm run test