### DEV
# Build client and server
build-dev:
	cd server && docker build -f Dockerfile.dev -t bullhorn-api-dev .
	cd client && docker build -f Dockerfile.dev -t bullhorn-client-dev .
# Build just the client
build-dev-client:
	cd server && docker build -f Dockerfile.dev -t bullhorn-api-server .
# Build just the server
build-dev-server:
	cd server && docker build -f Dockerfile.dev -t bullhorn-api-server .
# Run the whole app
run-dev:
	docker-compose -f docker-compose.dev.yml up

### LOCAL (prod config)
build-local:
	cd server && docker build \
	--build-arg CADDYFILE=Caddyfile.local \
	-f Dockerfile.prod -t bullhorn-api-dev:local .
	cd client && docker build -f Dockerfile.prod -t bullhorn-client-dev:local .
run-local:
	ENV=local docker-compose -f docker-compose.production.yml up
		

### PROD

build-production:
	cd client && $(MAKE) build-production
	cd server && $(MAKE) build	

run-production:
	ENV=production docker-compose -f docker-compose.production.yml up
	
stop:
	docker-compose down


### REMOTE

SSH_STRING:=root@161.35.104.130

ssh:
	ssh $(SSH_STRING)


# apt install make

copy-files:
	scp -r ./* $(SSH_STRING):/root/

# when you add firewall rule, have to add SSH on port 22 or it will stop working

# run challenge with cloudflare on flexible, then bump to full