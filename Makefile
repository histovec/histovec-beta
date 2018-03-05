export APP=starterapp
export APP_PATH := $(shell pwd)
export BACKEND=${APP_PATH}/backend
export FRONTEND=${APP_PATH}/frontend
export DC_DIR=${APP_PATH}
export DC_PREFIX=${DC_DIR}/docker-compose

date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

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
