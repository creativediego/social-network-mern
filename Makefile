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
	-f Dockerfile.prod -t social-app:server-production-latest .

build-production: build-client-production build-server-production
	
run-production: cleanup
	NODE_ENV=production API_PORT=4000 CLIENT_PORT=443 ENV_FILE=./.env.production \
    TLS_CERT_FILE=./tls_cert.pem TLS_KEY_FILE=./tls_key.pem \
	docker compose --env-file -f docker-compose.prod.yml --verbose up --detach

cleanup:
    @CLIENT_CONTAINER=$$(docker ps -qf ancestor=buzzcentral:client-production-latest); \
    @SERVER_CONTAINER=$$(docker ps -qf ancestor=buzzcentral:server-production-latest); \
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
	echo "\nCompressing local files..." && \
	tar czf ../app_file.tar.gz --exclude='node_modules' -C ./ . && \
	echo "\nUploading app tar file to server..." && \
	scp -i $(PEM) ../app_file.tar.gz $(SERVER):/root/buzzcentral/ && \
    echo "\niles copied to server successfully." && \
    echo "\nSSHing into server to unpack the tar file..." && \
    ssh -i $(PEM) $(SERVER) 'cd /root/buzzcentral/ && rm -r app && mkdir -p app && \
    tar xzf app_file.tar.gz -C app && rm app_file.tar.gz' && \
    echo "Tar file unpacked inside the app folder on the server."
    
deploy: copy
	echo "\nDeploying app on server..." && \
    ssh -i $(PEM) $(SERVER) 'cd /root/buzzcentral/app && \
    make build-production && make run-production' && \
    echo "App deployed successfully."

# ### LOCAL (production config)
# # Builds client and server with prod config but with local port 80 caddy client srv.
build-production-local:
	cd client && docker build \
	--build-arg CADDYFILE=Caddyfile.local \
	-f Dockerfile.prod -t buzzcentral:client-production-latest .
	cd server && docker build \
	-f Dockerfile.prod -t buzzcentral:server-production-latest .

run-production-local: cleanup
	NODE_ENV=production API_PORT=4000 CLIENT_PORT=80 ENV_FILE=./.env.local \
    TLS_CERT_FILE=./tls_cert.pem TLS_KEY_FILE=./tls_key.pem \
	docker compose -f docker-compose.prod.yml --verbose up --detach