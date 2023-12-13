### DEVEVLOPMENT
# Build just the client
build-dev-client:
	cd client && docker build -f Dockerfile.dev -t social-client-dev .
# Build just the server
build-dev-server:
	cd server && docker build -f Dockerfile.dev -t social-api-dev .
build-dev: build-dev-client build-dev-server
# Run the whole app
run-dev:
	docker-compose -f docker-compose.dev.yml up
		
### PRODUCTION
# Builds client and server with prod config 
build-client-production:
	cd client && docker build \
	--build-arg CADDYFILE=Caddyfile.production \
	-f Dockerfile.prod -t social-app:client-production-latest .
	
build-server-production:
	cd server && docker build \
	-f Dockerfile.prod -t social-app:server-local-latest .

build-production: build-client-production build-server-production
	
run-production: cleanup
	ENV=production API_PORT=4000 CLIENT_PORT=443  \
	docker compose --env-file $(ENV_FILE) -f docker-compose.prod.yml --verbose up --detach

cleanup:
    @CLIENT_CONTAINER=$$(docker ps -qf ancestor=social-app:client-production-latest); \
    @SERVER_CONTAINER=$$(docker ps -qf ancestor=social-app:server-local-latest); \
    if [ -n "$$CLIENT_CONTAINER" ]; then \
        echo "Stopping and removing client container: $$CLIENT_CONTAINER"; \
        docker stop $$CLIENT_CONTAINER; \
        docker rm $$CLIENT_CONTAINER; \
    else \
        echo "No client container running."; \
    fi; \
    if [ -n "$$SERVER_CONTAINER" ]; then \
        echo "Stopping and removing server container: $$SERVER_CONTAINER"; \
        docker stop $$SERVER_CONTAINER; \
        docker rm $$SERVER_CONTAINER; \
    else \
        echo "No server container running."; \
    fi

stop:
	docker compose down

copy:
	echo "Compressing local files..."
	tar czf ../app_file.tar.gz --exclude='node_modules' -C ./ .
	echo "Uploading app tar file to server..."
	scp -i $(PEM) ../app_file.tar.gz $(SERVER)


# ### LOCAL (production config)
# # Builds client and server with prod config but with local port 80 caddy client srv.
# build-local:
# 	cd client && docker build \
# 	--build-arg CADDYFILE=Caddyfile.production \
# 	-f Dockerfile.prod -t $(APP_NAME):client-local-latest .
# 	cd server && docker build \
# 	-f Dockerfile.prod -t $(APP_NAME):server-local-latest .
# run-local:
# 	ENV=local CLIENT_PORT=80 REPO_NAME=buzzcentral API_PORT=4000 \
#     docker-compose --env-file $(ENV_FILE) -f docker-compose.prod.yml up