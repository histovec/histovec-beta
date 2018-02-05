export APP=myfabapp
export APP_PATH := $(shell pwd)
export ES_PATH=${APP_PATH}/elasticsearch
export BACKEND=${APP_PATH}/backend
export FRONTEND=${APP_PATH}/frontend
export DC_DIR=${APP_PATH}/docker-components
export DC_PREFIX=${DC_DIR}/docker-compose

date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

ES_NODES := 1
PG := 'postgres'
DC := 'docker-compose'

docker-clean: stop
	docker container rm ${APP}-build-front ${APP}-nginx ${APP}-elasticsearch ${APP}-postgres ${APP}-kibana

clean:
	@echo cleaning ${APP} frontend npm dist
	sudo rm -rf ${FRONTEND}/dist

network-stop:
	@echo cleaning ${APP} docker network
	docker network rm ${APP}

network:
	@docker network create ${APP} 2> /dev/null; true

# elasticsearch-stop:
# 	@echo docker-compose down ${APP} elasticsearch
# 	@${DC} -f ${DC_PREFIX}-elasticsearch.yml down

# elasticsearch: network
# ifeq "$(ES_NODES)" "1"
# 	@sudo mkdir -p ${ES_PATH} && sudo chmod 777 ${ES_PATH}/.
# 	${DC} -f ${DC_PREFIX}-elasticsearch.yml up --build -d
# else
# 	@echo docker-compose up elasticsearch with ${ES_NODES} nodes
# 	@cat ${DC_PREFIX}-elasticsearch.yml > ${DC_PREFIX}-elasticsearch-huge.yml
# 	@i=2; $while [$i -le $ES_NODES]; do cat ${DC_PREFIX}-elasticsearch-node.yml | sed "s/%N/$i" >> ${DC_PREFIX}-elasticsearch-huge.yml;done
# 	${DC} -f ${DC_PREFIX}-elasticsearch-huge.yml up -d 
# endif

# kibana-stop:
# 	${DC} -f ${DC_PREFIX}-kibana.yml down
# kibana: network
# 	${DC} -f ${DC_PREFIX}-kibana.yml up -d

# postgres-stop:
# 	${DC} -f ${DC_PREFIX}-${PG}.yml down

# postgres: network
# 	${DC} -f ${DC_PREFIX}-${PG}.yml up -d

backend-stop:
	${DC} -f ${DC_PREFIX}-backend.yml down

backend: network
	${DC} -f ${DC_PREFIX}-backend.yml up --build -d

backend-log:
	${DC} -f ${DC_PREFIX}-backend.yml logs --build -d

frontend-dev: network 
	@echo docker-compose up frontend for dev
	${DC} -f ${DC_PREFIX}-dev-frontend.yml up --build -d --force-recreate 

frontend-dev-stop:  
	${DC} -f ${DC_PREFIX}-dev-frontend.yml down 

dev-log:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml logs
	${DC} -f ${DC_PREFIX}-backend.yml logs

dev: network backend frontend-dev

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

# frontend-stop:
# 	${DC} -f ${DC_PREFIX}-run-frontend.yml down

# frontend: frontend-build
# 	${DC} -f ${DC_PREFIX}-run-frontend.yml up -d

# frontend-log:
# 	${DC} -f ${DC_PREFIX}-run-frontend.yml log

# stop: backend-stop elasticsearch-stop kibana-stop postgres-stop 
# 	@echo all components stopped

# start-all: start postgres
# 	@echo all components started, please enter following command to supervise: 

# start: elasticsearch kibana backend frontend
# 	@echo all components started


