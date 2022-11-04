## Build and run the dev docker image
docker-run:	
	docker build -t element-backend . && docker run --env-file='.env-dev' -p 3000:3000 element-backend

## Run locally dev using npm
run:
	npm run start