
docker-build:
	docker build . -t bloglog:v0.0.1

docker-run:
	docker run -it -p 3000:3000 --env-file .env.local bloglog:v0.0.1