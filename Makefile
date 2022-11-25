## CONTAINER COMMANDS
# Build and run backend service and redis locally. !! keep in mind --build flag will build re-build the images each time
local-up:
	docker-compose up

local-up-build:
	docker-compose up --build

# Build and run redis separately !! Not possible to connect if built separately for now
redis:
	docker build -t redis -f Dockerfile-redis . && docker run -p 6379:6379 redis

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