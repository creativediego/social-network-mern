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
	--build-arg CADDYFILE=Caddyfile.production --build-arg ENV_FILE=.env.production \
	-f Dockerfile.prod -t buzzcentral:client-production-latest .
	
build-server-production:
	cd server && docker build --build-arg ENV_FILE=.env.production \
	-f Dockerfile.prod -t buzzcentral:server-production-latest .

build-production: build-client-production build-server-production
	
run-production: stop-production
	NODE_ENV=production API_PORT=4000 CLIENT_PORT=443  \
    TLS_CERT_FILE=./tls_cert.pem TLS_KEY_FILE=./tls_key.pem \
	docker compose -f docker-compose.prod.yml --verbose up --detach

stop-production:
	NODE_ENV=production API_PORT=4000 CLIENT_PORT=443  \
	TLS_CERT_FILE=./tls_cert.pem TLS_KEY_FILE=./tls_key.pem \
	docker compose -f docker-compose.prod.yml down

cleanup:
	docker rmi $(docker images -q)

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
    
deploy: 
	echo "\nDeploying app on server..." && \
    echo "\nSSHing..." && \
    ssh -i $(PEM) $(SERVER) 'cd /root/buzzcentral/app && \
    echo "\nBuilding containers..." && \
    make build-production && \
    echo "\nRunning containers..." && \
    make run-production && \
    echo "App deployed successfully."'

# ### LOCAL (production config)
# # Builds client and server with prod config but with local port 80 caddy client srv.
build-production-local:
	cd client && docker build \
	--build-arg CADDYFILE=Caddyfile.local --build-arg ENV_FILE=./.env.productionlocal \
	-f Dockerfile.prod -t buzzcentral:client-production-latest .
	cd server && docker build --build-arg ENV_FILE=./.env.productionlocal \
	-f Dockerfile.prod -t buzzcentral:server-production-latest .

run-production-local: cleanup
	NODE_ENV=production API_PORT=4000 CLIENT_PORT=80 \
    TLS_CERT_FILE=./tls_cert.pem TLS_KEY_FILE=./tls_key.pem \
	docker compose -f docker-compose.prod.yml --verbose up --detach