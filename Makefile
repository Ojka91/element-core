## CONTAINER COMMANDS
# Build and run backend service and redis locally
local-up:
	docker-compose up --build

# Build and run redis
docker build -t redis -f Dockerfile-redis . && docker run -p 6379:6379 redis

# Build and run the dev docker image
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