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
	-f Dockerfile.prod -t social-client-prod:local .
	cd server && docker build \
	-f Dockerfile.prod -t social-api-prod:local .
run-local:
	ENV=local CLIENT_URL=localhost:80 REACT_APP_CLIENT_URL=localhost:80 \
	docker-compose -f docker-compose.prod.yml up 
		
### PRODUCTION
# Builds client and server with prod config for Amazon ECR
build-client-production:
	cd client 
	docker build \
    --build-arg CADDYFILE=Caddyfile.production \
    -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f Dockerfile.prod . \
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
build-server-production:
	cd server
	docker build \
	-t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f Dockerfile.prod . \
	docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
run-production:
	ENV=production CLIENT_URL=localhost:80 REACT_APP_CLIENT_URL=localhost:80 \
	docker-compose -f docker-compose.prod.yml up 
stop:
	docker-compose down

# ### REMOTE SSH INTO DEPLOYMENT SERVER
# SSH_STRING:=root@161.35.104.130

# ssh:
# 	ssh $(SSH_STRING)


# # apt install make

# copy-files:
# 	scp -r ./* $(SSH_STRING):/root/

# # when you add firewall rule, have to add SSH on port 22 or it will stop working

# # run challenge with cloudflare on flexible, then bump to full