##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################


export PORT=80
export APP=starterapp
export COMPOSE_PROJECT_NAME=${APP}
export APP_PATH := $(shell pwd)
export BACKEND=${APP_PATH}/backend
export FRONTEND=${APP_PATH}/frontend
export DC_DIR=${APP_PATH}
export DC_PREFIX=${DC_DIR}/docker-compose

export ES_MEM=512m

date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

dummy               := $(shell touch artifacts)
include ./artifacts

DC := 'docker-compose'

docker-clean: stop
	docker container rm ${APP}-build-front ${APP}-nginx

clean:
	@echo cleaning ${APP} frontend npm dist
	sudo rm -rf ${FRONTEND}/dist

network-stop:
	@echo cleaning ${APP} docker network
	docker network rm ${APP}

network:
	@docker network create ${APP} 2> /dev/null; true

tor:
ifeq ("$(wildcard nginx/tor-ip.conf)","") 
	wget -q https://www.dan.me.uk/torlist/ -O - | sed "s/^/deny /g; s/$/;/g" >  nginx/tor-ip.conf
endif

elasticsearch:
ifeq ("$(wildcard ${BACKEND}/esdata/)","")
	@echo creating elasticsearch data directory
	@mkdir -p ${BACKEND}/esdata
	@chmod 777 ${BACKEND}/esdata/.
endif
	@docker-compose -f ${DC_PREFIX}-elasticsearch.yml up -d

backend-stop:
	${DC} -f ${DC_PREFIX}-backend.yml down

backend: network
	${DC} -f ${DC_PREFIX}-backend.yml up --build -d

backend-log:
	${DC} -f ${DC_PREFIX}-backend.yml logs --build -d

frontend-dev: network tor
	@echo docker-compose up frontend for dev
	${DC} -f ${DC_PREFIX}-dev-frontend.yml up --build -d --force-recreate

frontend-dev-stop:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml down

dev-log:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml logs
	${DC} -f ${DC_PREFIX}-backend.yml logs

dev: network backend elasticsearch frontend-dev

dev-stop: backend-stop frontend-dev-stop network-stop


frontend-build: frontend-download network
ifneq "$(commit-frontend)" "$(lastcommit-frontend)"
	@echo building ${APP} frontend after new commit
	@make clean
	@echo building frontend in ${FRONTEND}
	@sudo mkdir -p ${FRONTEND}/dist
	${DC} -f ${DC_PREFIX}-build-frontend.yml up --build
	@echo "${commit-frontend}" > ${FRONTEND}/.lastcommit
endif
