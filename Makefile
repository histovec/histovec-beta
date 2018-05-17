##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################


export PORT=80
export APP=histovec
export COMPOSE_PROJECT_NAME=${APP}
export APP_PATH := $(shell pwd)
export BACKEND=${APP_PATH}/backend
export FRONTEND=${APP_PATH}/frontend
export DC_DIR=${APP_PATH}
export DC_PREFIX=${DC_DIR}/docker-compose

export ES_MEM=512m

# data prep (data not included in repo)
export datadir=sample_data
export datasource=${datadir}/siv.csv.gz.gpg
export datasource_json=${datadir}/siv.json.gz
export dataset=siv
export mapping={"_all": {"enabled": false}, "dynamic": false, "properties": {"id": {"type": "keyword"}}}
export index_log=${datadir}/index.log.gz

date                := $(shell date -I)
id                  := $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 8 | head -n 1)

vm_max_count		:= $(shell cat /etc/sysctl.conf | egrep vm.max_map_count\s*=\s*262144 && echo true)

dummy               := $(shell touch artifacts)
include ./artifacts

commit              := $(shell git rev-parse HEAD | cut -c1-8)
lastcommit          := $(shell touch .lastcommit && cat .lastcommit)


DC := 'docker-compose'

install-prerequisites:
ifeq ("$(wildcard /usr/bin/docker)","")
        echo install docker-ce, still to be tested
        sudo apt-get update
        sudo apt-get install \
        apt-transport-https \
        ca-certificates \
        curl \
        software-properties-common

        curl -fsSL https://download.docker.com/linux/${ID}/gpg | sudo apt-key add -
        sudo add-apt-repository \
                "deb https://download.docker.com/linux/ubuntu \
                `lsb_release -cs` \
                stable"
        sudo apt-get update
        sudo apt-get install -y docker-ce
        @(if (id -Gn ${USER} | grep -vc docker); then sudo usermod -aG docker ${USER} ;fi) > /dev/null
endif
ifeq ("$(wildcard /usr/local/bin/docker-compose)","")
	@echo installing docker-compose
	@sudo curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	@sudo chmod +x /usr/local/bin/docker-compose
endif

dataprep:
ifeq ("$(wildcard ${datasource})","")
	@echo WARNING: missing data source ${datasource}
endif
ifeq ("$(wildcard ${datasource_json})","")
	@echo decrypting csv to json for bulk load into elasticsearch, enter your key and wait about 3 minutes
	@gpg -d ${datasource} | gunzip |  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e '$$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\"}}\n";$$i=0;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",split(/;/,$$_)))."}\n";}}'| sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | gzip > ${datasource_json}
endif

index-purge: network elasticsearch
	@sleep 3
	@docker exec -it ${APP}-elasticsearch curl -XDELETE localhost:9200/${dataset} | sed 's/{"acknowledged":true}/index purged/'
	@echo

index-create: network elasticsearch
ifeq ("$(shell docker exec -it ${APP}-elasticsearch curl -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l)","1")
else
	@echo
	@docker exec -it ${APP}-elasticsearch curl -XPUT localhost:9200/${dataset}
	@echo
	@docker exec -it ${APP}-elasticsearch curl -H "Content-Type: application/json" -XPUT localhost:9200/${dataset}/_mapping/${dataset} -d '${mapping}' | sed 's/{"acknowledged":true}/index created with mapping/'
	@echo
	@echo wating a few seconds for index being up
	@sleep 3

endif

index-load: dataprep index-create
ifeq ("$(shell docker exec -it ${APP}-elasticsearch curl -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l)","1")
	zcat ${datasource_json} | split -l 10000 --filter='docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | gzip > ${index_log}
endif

docker-clean: stop
	docker container rm ${APP}-build-front ${APP}-nginx

frontend-clean:
	@echo cleaning ${APP} frontend npm dist
	sudo rm -rf ${FRONTEND}/dist

clean: index-purge docker-clean frontend-clean

network-stop:
	@echo cleaning ${APP} docker network
	docker network rm ${APP}

network: install-prerequisites
	@docker network create ${APP} 2> /dev/null; true

tor:
ifeq ("$(wildcard nginx/tor-ip.conf)","") 
	wget -q https://www.dan.me.uk/torlist/ -O - | sed 's/^/deny /g; s/$$/;/g' >  nginx/tor-ip.conf
endif

vm_max:
ifeq ("$(vm_max_count)", "")
	@echo updating vm.max_map_count $(vm_max_count) to 262144
	sudo sysctl -w vm.max_map_count=262144
endif

elasticsearch: vm_max
ifeq ("$(wildcard ${BACKEND}/esdata/)","")
	@echo creating elasticsearch data directory
	@mkdir -p ${BACKEND}/esdata
	@chmod 777 ${BACKEND}/esdata/.
endif
	@docker-compose -f ${DC_PREFIX}-elasticsearch.yml up -d

elasticsearch-stop:
	${DC} -f ${DC_PREFIX}-elasticsearch.yml down

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

dev: network elasticsearch frontend-dev

dev-stop: backend-stop elasticsearch-stop frontend-dev-stop network-stop


frontend-build: network
ifneq "$(commit)" "$(lastcommit)"
	@echo building ${APP} frontend after new commit
	@make frontend-clean
	@echo building frontend in ${FRONTEND}
	@sudo mkdir -p ${FRONTEND}/dist
	${DC} -f ${DC_PREFIX}-build-frontend.yml up --build
	@echo "${commit-frontend}" > ${FRONTEND}/.lastcommit
endif
