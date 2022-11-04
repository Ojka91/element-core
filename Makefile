## Build and run the docker image
docker-run:	
	docker build -t element-backend . && docker run -p 3000:3000 element-backend

## Run locally using npm
run:
	npm run start:dev