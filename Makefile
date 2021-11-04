
docker-build:
	docker build . -t bloglog:v0.0.1

docker-run:
	docker run -it -p 3000:3000 --env-file .env bloglog:v0.0.1

compose-run:
	docker-compose up

generate-secret-dev:
	kubectl create secret generic frontend-secret --dry-run=client --from-env-file=.env.dev -o yaml > k8s/secret-dev.yaml

generate-secret-prod:
	kubectl create secret generic frontend-secret --dry-run=client --from-env-file=.env.prod -o yaml > k8s/secret-prod.yaml