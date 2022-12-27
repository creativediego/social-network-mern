# Development-based docker files
build-dev:
	cd client && $(MAKE) build-dev
	cd server && $(MAKE) build

run-dev:
	docker-compose -f docker-compose-dev.yml up

# LOCAL PROD CONFIG
# Local build that runs a caddy server and not dev version of react client
# Hot realod and mount source code into image
build-local:
	cd client && $(MAKE) build-local
	cd server && $(MAKE) build

run-local:
	ENV=local docker-compose -f docker-compose-production.yml up

# Similar to local but does not hot load source code into container.
# To be run on the prod server.
build-production:
	cd client && $(MAKE) build-production
	cd server && $(MAKE) build

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up
	
build-heroku:
	docker-compose -f heroku.yml up

stop:
	docker-compose down