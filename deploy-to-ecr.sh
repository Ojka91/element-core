docker build -t aws-ecs-typescript-api .
docker tag aws-ecs-typescript-api:latest YOUR_AWS_ACCOUNT_NUMBER.dkr.ecr.YOUR_AWS_REGION.amazonaws.com/aws-ecs-typescript-api:latest
aws ecr get-login-password --region YOUR_AWS_REGION | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_NUMBER.dkr.ecr.YOUR_AWS_REGION.amazonaws.com
docker push YOUR_AWS_ACCOUNT_NUMBER.dkr.ecr.YOUR_AWS_REGION.amazonaws.com/aws-ecs-typescript-api:latest
aws ecs update-service --cluster aws-ecs-typescript-api --service aws-ecs-typescript-api --force-new-deployment