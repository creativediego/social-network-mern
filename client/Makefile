build-dev:
	sudo docker build -t client .

build-local:
	docker build \
	-t client:local \
	--build-arg CADDYFILE=Caddyfile.local \
	-f Dockerfile.production .

build-production:
	docker build -t  client-production  -f Dockerfile.production