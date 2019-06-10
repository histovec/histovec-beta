##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################


##############################################
#              general OS vars               #
##############################################
SHELL:=/bin/bash

ifeq ($(OS),Windows_NT)
    uname_S := Windows
else
    uname_S := $(shell uname -s)
endif

ifeq ($(uname_S),Linux)
    INSTALL := sudo apt-get install -y
else
    INSTALL := brew install
endif

export USE_TTY := $(shell test -t 1 && USE_TTY="-t")

##############################################
#         APP configuration section          #
##############################################
export PORT=80
export APP=histovec
export COMPOSE_PROJECT_NAME=${APP}
export APP_PATH := $(shell pwd)
export APP_VERSION	:= $(shell git describe --tags || cat VERSION )
export LOGS=${APP_PATH}/log
# build options
export DC_BUILD_ARGS = --pull --no-cache
export BUILD_DIR=${APP_PATH}/${APP}-build
export DC_DIR=${APP_PATH}
export DC_PREFIX=${DC_DIR}/docker-compose
export DC := docker-compose
export NPM_REGISTRY = $(shell echo $$NPM_REGISTRY )
export SASS_REGISTRY = $(shell echo $$SASS_REGISTRY )
export dollar = $(shell echo \$$)
export API_VERSION_V0=v0
export API_VERSION_V1=v1
export API_VERSION=${API_VERSION_V0}

##############################################
#              reverse-proxy                 #
##############################################
export NGINX=${APP_PATH}/nginx
export NGINX_LOGS=${LOGS}/nginx
export API_USER_LIMIT_RATE=1r/m
export API_USER_BURST=3 nodelay
export API_USER_SCOPE=http_x_forwarded_for
export API_GLOBAL_LIMIT_RATE=5r/s
export API_GLOBAL_BURST=20 nodelay
export API_WRITE_LIMIT_RATE=10r/m
export API_WRITE_BURST=20 nodelay
# packaging
FILE_IMAGE_NGINX_APP_VERSION = $(APP)-nginx-$(APP_VERSION)-image.tar
FILE_IMAGE_NGINX_LATEST_VERSION = $(APP)-nginx-latest-image.tar
DC_RUN_NGINX_FRONTEND = ${DC_PREFIX}-run-frontend.yml

##############################################
#                 frontend                   #
##############################################
export FRONTEND=${APP_PATH}/frontend
export FRONTEND_DEV_HOST=frontend-dev
export FRONTEND_DEV_PORT=8080
# packaging html/js/css & docker targets
export FILE_FRONTEND_APP_VERSION = $(APP)-$(APP_VERSION)-frontend.tar.gz
export FILE_FRONTEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-frontend-dist.tar.gz
export FILE_FRONTEND_DIST_LATEST_VERSION = $(APP)-latest-frontend-dist.tar.gz
export DC_BUILD_FRONTEND = ${DC_PREFIX}-build-frontend.yml


##############################################
#           elasticsearch confs              #
#          ES_MEM should be 4096m            #
#            in production mode              #
##############################################
export ES_MEM=512m
export ES_HOST=elasticsearch
export ES_PORT=9200
# vm_max_count has to be fixed into the vm host
# or elasticsearch won't start
export MAX_MAP_COUNT=262144
export vm_max_count		:= $(shell cat /etc/sysctl.conf 2>&1 | egrep vm.max_map_count\s*=\s*262144 && echo true)

##############################################
#             data prep parameters           #
#    for data injection into elasticsearch   #
##############################################
# datasource parameters
export decrypted_datadir=${APP_PATH}/data/decrypted
export DATAPREP=${APP_PATH}/dataprep
export datadir=${APP_PATH}/data/encrypted
export data_remote_dir=${APP}-data
export data_remote_files=.*_(siv|ivt)_api_.*
export data_remote_files_inc=.*_(siv|ivt)_api-inc_.*
export dataset=siv
export FROM=1
export PASSPHRASE=CHANGEME
# elasticsearch parameters
export ES_INDEX=${dataset}
export settings={"index": {"number_of_shards": 1, "refresh_interval": "300s", "number_of_replicas": 0}}
export mapping={"_all": {"enabled": false}, "dynamic": false, "properties": {"idv": {"type": "keyword"}, "ida1": {"type": "keyword"}, "ida2": {"type": "keyword"}}}
export ES_CHUNK=5000
export ES_VERBOSE=100000
export ES_VERBOSE_UPDATE=1000
export ES_TIMEOUT=60
export ES_JOBS=4
export header="idv;ida1;ida2;v"
# openstack swift source parameters
# auth token has to be provided before within env
export openstack_retry=10
export openstack_delay=5
export openstack_timeout=10
export openstack_url := $(shell echo $$openstack_url )
export openstack_auth_id := $(shell echo $$openstack_auth_id )
export openstack_token := $(shell [ -n "$$openstack_token" ] && echo $$openstack_token | tr '\n' ' ')

##############################################
#               backend confs                #
#                 v1+ only                   #
##############################################
export BACKEND=${APP_PATH}/backend
export BACKEND_HOST=backend
export BACKEND_PORT=8000
export BACKEND_SECRET=%ch4NGM3!
export BACKEND_LOGS=${LOGS}/backend
# mail confs for backend and fake smtp
# must be overrided for production mode
export MAIL_FROM=histovec@fake.mi
export MAIL_TO=histovec@fake.mi
export SMTP_SERVER=smtp
export SMTP_PORT=25
# redis confs for backend and cache of utac data
export REDIS_PERSIST=86400
export REDIS_URL=redis
# utac confs for backend and fake api
export UTAC_SCHEME=http
export UTAC_HOST=utac
export UTAC_PORT=9000
export UTAC_API=utac
export UTAC_LATENCY=300
export UTAC_TIMEOUT=5000

##############################################
#                 test confs                 #
##############################################
# performance test confs
export PERF=${APP_PATH}/tests/performance
export PERF_IDS=${PERF}/ids.csv
export PERF_SCENARIOS:=$(shell ls ${PERF}/scenarios/*)
export PERF_REPORTS=${PERF}/reports/

dummy               := $(shell touch artifacts)
include ./artifacts

# combined variables should not be overrided
export CURL_OS_OPTS=-k --retry ${openstack_retry} --retry-delay ${openstack_delay} --connect-timeout ${openstack_timeout} --fail
export NGINX_SERVER_TEMPLATE=nginx-run-${API_VERSION}.template
export BACKEND_START=$(shell [ ${API_VERSION} = "v1" ] && echo backend-start)
export BACKEND_STOP=$(shell [ ${API_VERSION} = "v1" ] && echo backend-stop)


##############################################
##############################################
####           PROCEDURES                 ####
##############################################
##############################################

##############################################
#       host configuration procedures        #
##############################################
install-prerequisites:
ifeq ("$(wildcard /usr/bin/docker /usr/local/bin/docker)","")
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
	@sudo curl -s -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	@sudo chmod +x /usr/local/bin/docker-compose
endif

install-prerequisites-injection:
ifeq ("$(wildcard /usr/bin/gawk /usr/local/bin/gawk)","")
	@echo installing gawk with ${INSTALL}, as needed for data injection
	@${INSTALL} gawk
endif

ifeq ("$(wildcard /usr/bin/jq /usr/local/bin/jq)","")
	@echo installing jq with ${INSTALL}, as needed for data injection
	@${INSTALL} jq
endif
ifeq ("$(wildcard /usr/bin/parallel /usr/local/bin/parallel)","")
	@echo installing parallel with ${INSTALL}, as needed for data injection
	@${INSTALL} parallel
endif


##############################################
#                  RUN APP                   #
##############################################
# run / stop all services in qualification (compiled) mode
up: network elasticsearch ${BACKEND_START} frontend
	@echo run all services in production mode

down: frontend-stop elasticsearch-stop ${BACKEND_STOP} network-stop

up-all: network-all elasticsearch frontend-nginx

down-all: frontend-nginx-stop elasticsearch-stop network-stop

# production mode with fake
up-fake: utac-fake-start smtp-fake up
	@echo run fake services for smtp and utac

down-fake: smtp-fake-stop utac-fake-stop down

# build for production mode
build: frontend-build backend-build

# clean for fresh start
clean: index-purge docker-clean frontend-clean

docker-clean: stop
	docker container rm ${APP}-build-front ${APP}-nginx

# development mode
dev: network wait-elasticsearch utac-fake-start smtp-fake backend-dev frontend-dev

dev-stop: elasticsearch-stop frontend-dev-stop backend-dev-stop utac-fake-stop smtp-fake-stop network-stop

dev-log:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml logs
	${DC} -f ${DC_PREFIX}-backend.yml logs

# network operations
network: install-prerequisites
	@docker network create --opt com.docker.network.driver.mtu=1450 ${APP} 2> /dev/null; true

network-all: network

network-stop:
	@echo cleaning ${APP} docker network
	docker network rm ${APP}

tor:
ifeq ("$(wildcard nginx/tor-ip.conf)","")
	wget -q https://www.dan.me.uk/torlist/ -O - | sed 's/^/deny /g; s/$$/;/g' >  nginx/tor-ip.conf
endif

update:
	git pull origin dev

build-dir:
	if [ ! -d "$(BUILD_DIR)" ] ; then mkdir -p $(BUILD_DIR) ; fi

build-dir-clean:
	if [ -d "$(BUILD_DIR)" ] ; then rm -rf $(BUILD_DIR) ; fi

##############################################
#               reverse-proxy                #
#                    and                     #
#                 frontend                   #
##############################################
# production mode
frontend-nginx: frontend

frontend-nginx-stop: frontend-stop

# qualification (compiled) mode

frontend: network tor
	@export EXEC_ENV=production; ${DC} -f $(DC_RUN_NGINX_FRONTEND) up -d 2>&1 | grep -v orphan

frontend-stop:
	@export EXEC_ENV=production; ${DC} -f $(DC_RUN_NGINX_FRONTEND) down

# build for qualification and production
frontend-build: build-dir frontend-build-all nginx-build

frontend-build-all: network frontend-build-dist frontend-build-dist-archive

frontend-prepare-build:
	if [ -f "${FRONTEND}/$(FILE_FRONTEND_APP_VERSION)" ] ; then rm -rf ${FRONTEND}/$(FILE_FRONTEND_APP_VERSION) ; fi
	( cd ${FRONTEND} && tar -zcvf $(FILE_FRONTEND_APP_VERSION) --exclude ${APP}.tar.gz \
          index.html \
         .babelrc \
         .editorconfig \
         .eslintignore \
         .eslintrc.js \
         config \
         src \
         build \
         static )

frontend-check-build:
	export EXEC_ENV=build-deploy; ${DC} -f $(DC_BUILD_FRONTEND) config -q

frontend-build-dist: frontend-prepare-build frontend-check-build
	@echo building ${APP} frontend in ${FRONTEND} using $NGINX_SERVER_TEMPLATE
	export EXEC_ENV=build-deploy; ${DC} -f $(DC_BUILD_FRONTEND) build $(DC_BUILD_ARGS)

frontend-build-dist-archive:
	export EXEC_ENV=build-deploy; ${DC} -f $(DC_BUILD_FRONTEND) run -T --rm frontend-build tar zCcf $$(dirname /$(APP)/dist) - $$(basename /$(APP)/dist)  > $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION)
	  cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION)
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) ; fi
	if [ -f $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_FRONTEND_DIST_LATEST_VERSION) ; fi

frontend-clean-dist:
	@rm -rf $(FILE_FRONTEND_APP_VERSION)

frontend-clean-dist-archive:
	@rm -rf $(FILE_FRONTEND_DIST_APP_VERSION)

frontend-clean-image:
	@( ${DC} -f $(DC_BUILD_FRONTEND) config | \
           python -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

nginx-build: nginx-build-image

nginx-build-image: $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx-check-build tor
	@echo building ${APP} nginx
	cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx/
	export EXEC_ENV=production; ${DC} -f $(DC_RUN_NGINX_FRONTEND) build $(DC_BUILD_ARGS)

nginx-check-build:
	export EXEC_ENV=production;${DC} -f $(DC_RUN_NGINX_FRONTEND) config -q

nginx-save-image:
	nginx_image_name=$$(export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_FRONTEND) config | python -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r .services.nginx.image) ; \
        nginx_image_name_version=$$(echo $$nginx_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker tag $$nginx_image_name $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_NGINX_APP_VERSION) $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_NGINX_LATEST_VERSION) $$nginx_image_name

nginx-clean-image:
	@( ${DC} -f $(DC_RUN_NGINX_FRONTEND) config | \
           python -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# clean build
frontend-clean:
	@echo cleaning ${APP} frontend npm dist
	sudo rm -rf ${FRONTEND}/dist

# development mode
frontend-dev: network tor
	@echo docker-compose up frontend for dev ${VERSION}
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-dev-frontend.yml up --build -d --force-recreate 2>&1 | grep -v orphan

frontend-dev-stop:
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-dev-frontend.yml down

##############################################
#               elasticsearch                #
##############################################
# production and dev mode
elasticsearch: vm_max network
ifeq ("$(wildcard ${BACKEND}/esdata/)","")
	@echo creating elasticsearch data directory
	@mkdir -p ${BACKEND}/esdata
	@chmod 777 ${BACKEND}/esdata/.
endif
	@${DC} -f ${DC_PREFIX}-elasticsearch.yml up -d 2>&1 | grep -v orphan

elasticsearch-stop:
	${DC} -f ${DC_PREFIX}-elasticsearch.yml down

vm_max:
ifeq ("$(vm_max_count)", "")
	@if [ ${uname_S} == "Darwin" ]; then echo "WARNING: detected Darwin - vm.map_max_count=262144 settings can't be checked and correctly set. You should set it manually within your Docker virtual machine. This setting has to be set for elasticsearch."; else sudo sysctl -w vm.max_map_count=262144;fi
endif

wait-elasticsearch: elasticsearch
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/_cat/indices > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for elasticsearch to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

# index relative operations
wait-index: index-create
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for ${dataset} index - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

wait-index-purge: index-purge
	@timeout=${ES_TIMEOUT} ; ret=0 ; until [ "$$timeout" -le 1 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "1" ] ; then echo "waiting for ${dataset} index to be purged - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

index-purge: wait-elasticsearch
	@docker exec ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.blocks.read_only": false}' | sed 's/{"acknowledged":true.*/${dataset} index prepared for deletion\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/${dataset} | sed 's/{"acknowledged":true.*/${dataset} index purged\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/contact | sed 's/{"acknowledged":true.*/contact index purged\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/feedback | sed 's/{"acknowledged":true.*/feedback purged\n/;s/.*no such index.*//'

index-unlock: wait-elasticsearch
	docker exec ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.blocks.read_only": false}' | sed 's/{"acknowledged":true.*/${dataset} index unlocked\n/;s/.*no such index.*//'

index-lock: wait-elasticsearch
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-create: wait-index-purge
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -H "Content-Type: application/json" -XPUT localhost:9200/${dataset} -d '{"settings": ${settings}, "mappings": { "${dataset}": ${mapping}}}' | sed 's/{"acknowledged":true.*/${dataset} index created with mapping\n/'
	@docker exec -i ${USER_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/contact | sed 's/{"acknowledged":true.*/contact index created\n/'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/feedback | sed 's/{"acknowledged":true.*/feedback created\n/'

index-status: wait-elasticsearch
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET localhost:9200/${dataset}?pretty
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET localhost:9200/_cat/indices

# elasticsearch backup operations
first-backup:
	@mkdir -p ${BACKEND}/backup/esdata && \
		echo `date +'%Y%m%d_%H:%M'` first rsync && \
		rsync -a ${BACKEND}/esdata/. ${BACKEND}/backup/esdata/.

last-backup:
	@mkdir -p ${BACKEND}/backup/esdata && \
		echo `date +'%Y%m%d_%H:%M'` last rsync && \
		rsync -a ${BACKEND}/esdata/. ${BACKEND}/backup/esdata/.

post-backup:
	@echo `date +'%Y%m%d_%H:%M'` taring && \
		cd ${BACKEND}/backup/ && tar cf `date +%Y%m%d`_histovec.tar esdata/.
		echo `date +'%Y%m%d_%H:%M'` cleaning tmp dir && \
		rm -rf ${BACKEND}/backup/esdata && \
		echo `date +'%Y%m%d_%H:%M'` backup done in ${BACKEND}/backup/`date +%Y%m%d`_histovec.tar

backup: first-backup elasticsearch-stop last-backup elasticsearch post-backup


##############################################
#                 data prep                  #
##############################################
# dataprep dev mode - crypt anonymized data
# before inserting it in elasticsearch
data-encrypt: network
	@mkdir -p ${decrypted_datadir} ${datadir}
	@${DC} -f ${DC_PREFIX}-dataprep.yml up --build

# dataprep qualif mode - download data
# before inserting it in elasticsearch
data-download: network
	@mkdir -p ${datadir}
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}' | xargs -I{} curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o ${datadir}/{}

data-check: network
	@cd ${datadir} && ls | egrep '${data_remote_files}.gz' | xargs md5sum | sort > checksums1
	@cd ${datadir} && ls | egrep '${data_remote_files}.md5' | xargs cat | awk '{print $$2 " " $$3}' | sort > checksums2
	@cd ${datadir} && (diff -wb checksums1 checksums2 && echo data checked) || exit 1

index-load: install-prerequisites-injection wait-index
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $$1}' > /dev/null
	@(find ${datadir} | egrep '${data_remote_files}.gz' | xargs cat | gunzip ) | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "decrypted " n " lines" > "/dev/stderr";} n++}' |  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e '$$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\"}}\n";$$i=0;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",split(/;/,$$_)))."}\n";}}'| \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-check: install-prerequisites-injection wait-elasticsearch
		@(cd ${datadir} && ls | egrep '${data_remote_files}.gz' | xargs zcat | wc -l | awk '{print $$1}' && \
		(docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}/_search?q=*' | jq '.hits.total')) | tr '\n' ' ' | awk '{if ($$1 != $$2) {print "injection failed: wrong number of lines" > "/dev/stderr";exit 1} else {print "number of lines is ok"}}'

# dataprep production mode - from swift to elasticsearch
source-list:
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz'

check-rights:
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz' | wc -l

index-direct-load: install-prerequisites-injection wait-index
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz' | \
		parallel -j${ES_JOBS} '(>&2 echo {});curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "read " n " lines" > "/dev/stderr";} n++}' |  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e 'use Digest::SHA "sha256_base64"; $$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(@values[0]),0,20);print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=0;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}\n";}}' | \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

py-index-direct-load: wait-elasticsearch
	@mkdir -p ${decrypted_datadir} ${datadir}
	@${DC} -f ${DC_PREFIX}-dataprep.yml build
	@${DC} -f ${DC_PREFIX}-dataprep.yml run inject.py

index-direct-update: install-prerequisites-injection index-unlock
	@for date in `curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep "${data_remote_files_inc}" | sed 's/_\(siv\|ivt\).*//' | sort | uniq | sort -n`; \
		do for action in delete update create; \
			  do echo processing bulk $$action from $$date; \
					curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files_inc}.gz' | egrep $$date | egrep $$action | \
					parallel -j1 '(>&2 echo processing {});curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}" ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip | \
					awk -v action=$$action 'BEGIN{n = 1;print "bulk " action " into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%10000)==0) {print "read " n " lines" > "/dev/stderr";} n++}' | \
					perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | \
					perl -e 'use Digest::SHA "sha256_base64"; $$action="'"$$action"'";$$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(@values[0]),0,20);print "{\"$$action\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=0;if ($$action eq "update") {print "{ \"doc\": "} if ($$action ne "delete") {print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}";} if ($$action eq "update") {print "}\n"} elsif ($$action eq "create") {print "\n" }}}' | \
					sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
					parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | \
					jq -c '.items[]' | \
					awk -v action=$$action 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{matchstr="\"result\":\""action"d\"";if ($$0 ~ matchstr) { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE_UPDATE} == 0)) {print strftime("%Y%m%d-%H:%M") " " action "d:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}} END {print strftime("%Y%m%d-%H:%M") " " action "d:" ok " rejected:" ko " end of batch"}' #| \
				done; \
		done
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-direct-check: install-prerequisites-injection wait-elasticsearch
	@(curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.md5' | \
		xargs -I{} curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o - | awk 'BEGIN{n=0}{n+=$$1}END{print n}' && \
		(docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}/_search?q=*' | jq '.hits.total')) | tr '\n' ' ' | awk '{if ($$1 != $$2) {print "injection failed: wrong number of lines" > "/dev/stderr";exit 1} else {print "number of lines is ok"}}'

##############################################
#                  backend                   #
##############################################
# production mode
backend-start:
	@echo docker-compose up backend for production ${VERSION}
	@export EXEC_ENV=production; ${DC} -f ${DC_PREFIX}-backend.yml up --build -d 2>&1 | grep -v orphan

backend-stop:
	@export EXEC_ENV=production; ${DC} -f ${DC_PREFIX}-backend.yml down

# build for production
backend-build:
	@export EXEC_ENV=build; ${DC} -f ${DC_PREFIX}-backend.yml up --build --force-recreate backend 2>&1 | grep -v orphan

# development mode
backend-dev:
	@echo docker-compose up backend for dev ${VERSION}
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-backend.yml up --build -d --force-recreate 2>&1 | grep -v orphan

backend-dev-stop:
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-backend.yml down

# fake services for dev and test modes
utac-fake-start:
	@echo docker-compose up utac simulator for dev ${VERSION}
	@${DC} -f ${DC_PREFIX}-utac.yml up --build -d --force-recreate 2>&1 | grep -v orphan

utac-fake-stop:
	@${DC} -f ${DC_PREFIX}-utac.yml down

smtp-fake:
	@echo docker-compose up smtp fake mal simulator for dev ${VERSION}
	@${DC} -f ${DC_PREFIX}-smtp.yml up -d 2>&1 | grep -v orphan

smtp-fake-stop:
	@${DC} -f ${DC_PREFIX}-smtp.yml down

##############################################
#                   tests                    #
##############################################
index-test: wait-elasticsearch
	@echo index test
	@gpg --quiet --batch --yes --passphrase "${PASSPHRASE}" -d sample_data/siv.csv.gz.gpg | gunzip| awk -F ';' 'BEGIN{n=0}{n++;if (n>1){print $$1}}' | parallel -j1 'curl -s -XGET localhost:${PORT}/histovec/api/v0/id/{} ' | jq -c '{"took": .took, "hit": .hits.total}'

index-stress: wait-elasticsearch
	@echo stress test
	@export PERF_IDS_NB=`wc -l ${PERF_IDS} | awk '{print $1}'` && shuf ${PERF_IDS} | head -$(( ( RANDOM % ( ( ${PERF_IDS_NB} * 10) / 100 ) )  + 1 ))  > ${PERF_IDS}.random
	@${DC} -f ${DC_PREFIX}-artillery.yml build
	@for scenario in ${PERF_SCENARIOS};\
		do export PERF_SCENARIO=$${scenario};\
			report=reports/`basename $$scenario .yml`.json ;\
			${DC} -f ${DC_PREFIX}-artillery.yml run artillery run -e development -o $${report} scenario.yml; \
			${DC} -f ${DC_PREFIX}-artillery.yml run artillery report $${report}; \
		done
	@rm ${PERF_IDS}.random

