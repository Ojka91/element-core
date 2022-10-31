## Build and run the docker image
docker-run:	
	docker build -t elements-backend . && docker run -p 3000:3000 elements-backend

## Run locally using npm
run:
	npm run start