### DEVEVLOPMENT
# Build client and server
build-dev:
	cd server && docker build -f Dockerfile.dev -t social-api-dev .
	cd client && docker build -f Dockerfile.dev -t social-client-dev .
# Build just the client
build-dev-client:
	cd server && docker build -f Dockerfile.dev -t social-api-server .
# Build just the server
build-dev-server:
	cd server && docker build -f Dockerfile.dev -t social-api-server .
# Run the whole app
run-dev:
	docker-compose -f docker-compose.dev.yml up

### LOCAL (production config)
# Builds client and server with prod config but with local port 80 caddy client srv.
build-local:
	cd client && docker build \
	--build-arg CADDYFILE=Caddyfile.local \
	-f Dockerfile.prod -t $(DOCKER_USERNAME)/social-app:client-local-latest .
	cd server && docker build \
	-f Dockerfile.prod -t $(DOCKER_USERNAME)/social-app:server-local-latest .
run-local:
	ENV=local DOCKER_USERNAME=$(DOCKER_USERNAME) REACT_APP_CLIENT_PORT=80 API_PORT=4000 \
    docker-compose --env-file $(ENV_FILE) -f docker-compose.prod.yml up
		
### PRODUCTION
# Builds client and server with prod config 
build-client-production:
	cd client && docker build \
	--build-arg CADDYFILE=Caddyfile.production \
	-f Dockerfile.prod -t $(DOCKER_USERNAME)/social-app:client-production-latest .
build-server-production:
	cd server && docker build \
	-f Dockerfile.prod -t $(DOCKER_USERNAME)/social-app:server-production-latest .
	
run-production:
	ENV=production DOCKER_USERNAME=$(DOCKER_USERNAME) API_PORT=4000 CLIENT_PORT=80 \
	docker-compose -v --env-file $(ENV_FILE) -f docker-compose.prod.yml up
stop:
	docker-compose down

copy-files:
	echo "Compressing local files..."
	tar czf ../app_file.tar.gz --exclude='node_modules' -C ./ .
	echo "Uploading app tar file to server..."
	scp -i $(PEM) ../app_file.tar.gz $(SERVER):$(BASE_DIR)

