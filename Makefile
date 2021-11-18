##############################################
#              /!\ WARNING /!\               #
#                                            #
#     THIS FILE SHOULDN'T BE TOUCHED FOR     #
#        ENVIRONNEMENT CONFIGURATION         #
#                                            #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

##############################################
#              /!\ WARNING /!\               #
#                                            #
#  ALL public-backend TARGETS ARE SUPPOSED   #
#    TO RUN AFTER RUNNING backend    #
#       TARGETS IN ORDER TO MUTUALIZE        #
#     ElasticSearch AND Redis INSTANCES      #
#  AND TO SCALE public-backed HORIZONTALLY   #
##############################################

# COMMENT TO REMOVE AFTER TESTING A NEW BUILD 6 #

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
export curl_progress_bar=--progress-bar --write 'Downloaded %{url_effective} %{size_download} bytes in %{time_connect} seconds (%{speed_download} bytes/s)\n'


##############################################
#         APP configuration section          #
##############################################
NPM_VERBOSE?=false
NPM_LATEST?=false
NPM_FIX?=false

# HistoVec configuration
export APP=histovec
# HistoVec api configuration
export API=histovec-api
# common configuration
export PORT=80
export PORT_DEV=81
export COMPOSE_PROJECT_NAME=${APP}
export APP_PATH := $(shell pwd)
export APP_USER := $(shell whoami)
export APP_VERSION	:= $(shell git describe --tags || cat VERSION)
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
export API_VERSION_V1=v1
export API_VERSION=${API_VERSION_V1}
export AB_TESTING_PERCENTAGE=0
# packaging HistoVec
export FILE_ARCHIVE_APP_VERSION = $(APP)-$(APP_VERSION)-archive.tar.gz
export FILE_ARCHIVE_APP_LATEST_VERSION = $(APP)-latest-archive.tar.gz
# packaging HistoVec api
export FILE_ARCHIVE_API_VERSION = $(API)-$(APP_VERSION)-archive.tar.gz
export FILE_ARCHIVE_API_LATEST_VERSION = $(API)-latest-archive.tar.gz

# publish common
export PUBLISH_URL_BASE           = histovec-docker-images
# publish HistoVec
export PUBLISH_URL_APP_VERSION    = $(PUBLISH_URL_BASE)/$(APP_VERSION)
export PUBLISH_URL_LATEST_VERSION = $(PUBLISH_URL_BASE)/latest
# publish HistoVec api
export PUBLISH_URL_API_VERSION    = $(PUBLISH_URL_BASE)/$(API)-$(APP_VERSION)
export PUBLISH_URL_API_LATEST_VERSION = $(PUBLISH_URL_BASE)/$(API)-latest
# link VMs containers
export LOCAL_IP=$(shell hostname -I | awk '{print $$1}')


##############################################
#          APP reverse-proxy                 #
##############################################
export NGINX=${APP_PATH}/nginx
export NGINX_LOGS=${LOGS}/nginx
export NGINX_SERVER_TEMPLATE_V1=nginx-run-v1.template
export BACKEND_API_USER_LIMIT_RATE=1r/m
export BACKEND_API_USER_BURST=3 nodelay
export BACKEND_API_USER_SCOPE=http_x_forwarded_for
export BACKEND_API_GLOBAL_LIMIT_RATE=5r/s
export BACKEND_API_GLOBAL_BURST=20 nodelay
export BACKEND_API_WRITE_LIMIT_RATE=10r/m
export BACKEND_API_WRITE_BURST=20 nodelay
# packaging
export FILE_IMAGE_NGINX_APP_VERSION = $(APP)-nginx-$(APP_VERSION)-image.tar
export FILE_IMAGE_NGINX_LATEST_VERSION = $(APP)-nginx-latest-image.tar
export DC_RUN_NGINX_FRONTEND = ${DC_PREFIX}-run-frontend.yml


##############################################
#                 frontend                   #
##############################################
export FRONTEND=${APP_PATH}/frontend
export FRONTEND_DEV_HOST=frontend-dev
export FRONTEND_DEV_PORT=8080
export FRONTEND_CONF_PORT=8000
export FRONTEND_SOURCE_MAP=true
# packaging html/js/css & docker targets
export DC_BUILD_FRONTEND = ${DC_PREFIX}-build-frontend.yml
export FILE_FRONTEND_APP_VERSION = $(APP)-$(APP_VERSION)-frontend.tar.gz
export FILE_FRONTEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-frontend-dist.tar.gz
export FILE_FRONTEND_DIST_LATEST_VERSION = $(APP)-latest-frontend-dist.tar.gz


##############################################
#           elasticsearch confs              #
#                                            #
#          ES_MEM should be 4096m            #
#            in production mode              #
##############################################
export ES_DATA=${BACKEND}/esdata
export ES_DATA_BACKUP=${BACKEND}/backup/
export ES_MEM=512m
# Pass a FIP here
export ES_HOST?=${LOCAL_IP}
export ES_PORT=9200
export ES_URL=${ES_HOST}:${ES_PORT}
# vm_max_count has to be fixed into the vm host
# or elasticsearch won't start
export MAX_MAP_COUNT=262144
export vm_max_count		:= $(shell cat /etc/sysctl.conf 2>&1 | egrep vm.max_map_count\s*=\s*262144 && echo true)
# parameters recommanded to set on hot for redis (check vars)
export transparent_hugepage		:= $(shell cat /sys/kernel/mm/transparent_hugepage/enabled 2>&1 | grep '\[never\]' && echo true)
export vm_overcommit_memory		:= $(shell cat /etc/sysctl.conf 2>&1 | egrep vm.overcommit_memory\s*=\s*1 && echo true)
# build
export DC_ELASTICSEARCH      = ${DC_PREFIX}-elasticsearch.yml
export FILE_IMAGE_ELASTICSEARCH_APP_VERSION = $(APP)-elasticsearch-$(APP_VERSION)-image.tar
export FILE_IMAGE_ELASTICSEARCH_LATEST_VERSION = $(APP)-elasticsearch-latest-image.tar

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
export mapping={"_all": {"enabled": false}, "dynamic": false, "properties": {"ida1": {"type": "keyword"}, "ida2": {"type": "keyword"}}}
export ES_CHUNK=5000
export ES_VERBOSE=100000
export ES_VERBOSE_UPDATE=1000
export ES_TIMEOUT=60
export ES_JOBS=4
export header="idv;ida1;ida2;v;utac_ask_ct;utac_encrypted_immat;utac_encrypted_vin;controle_qualite"
# openstack swift source parameters
# auth token has to be provided before within env
export openstack_retry=10
export openstack_delay=5
export openstack_timeout=10
export openstack_url := $(shell echo $$openstack_url )
export openstack_auth_id := $(shell echo $$openstack_auth_id )
export openstack_token := $(shell [ -n "$$openstack_token" ] && echo $$openstack_token | tr '\n' ' ')


##############################################
#          common backend confs              #
##############################################

export BACKEND=${APP_PATH}/backend
export BACKEND_HOST=backend
export BACKEND_SECRET?=$(shell < /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c$${1:-32};echo;)
export BACKEND_LOGS=${LOGS}/backend

# mail confs for backend and fake smtp
# must be overrided for production mode
export MAIL_FROM=histovec@interieur.gouv.fr
export MAIL_TO=histovec@interieur.gouv.fr
export SMTP_SERVER=smtp
export SMTP_PORT=25

# redis confs for backend and cache of utac data
export REDIS=${BACKEND}/redis
export REDIS_DATA=${REDIS}/data-dummy
export REDIS_PERSIST=86400
# Pass a FIP here
export REDIS_HOST?=${LOCAL_IP}
export REDIS_PORT=6379
export REDIS_PASSWORD

# utac confs for backend and fake api
export FAKE_UTAC_SCHEME=http
export FAKE_UTAC_HOST=utac
export FAKE_UTAC_PORT=9000
export FAKE_UTAC_API=utac
export FAKE_UTAC_TIMEOUT=5000
export FAKE_UTAC_LATENCY=500

# Default values for dev environement
export IS_UTAC_API_ACTIVATED?=false
export IS_UTAC_CACHE_IGNORABLE?=false
export IS_UTAC_MOCK_FOR_BPSA_ACTIVATED?=false
export IS_VIN_SENT_TO_UTAC?=true
export UTAC_URL?=https://histovectest.utac-otc.com/histovec/api/v1.0
export UTAC_ID_KEY?=D2K8qvwHn36yBoENi5
export UTAC_TIMEOUT?=5000
export UTAC_USERNAME?=Ch@ng€-m€
export UTAC_PASSWORD?=Ch@ng€-m€-t0o
export HISTOVEC_PFX?=src/utac/histovec.pfx
export HISTOVEC_PFX_PASSPHRASE?=Ch@ng€-m€-pl€@se
export INES_TOKEN?=yOu-t0k€n-t0-m€?
export UTAC_PEM?=src/utac/utac.pem


##############################################
#               backend confs                #
##############################################

export BACKEND_PORT?=8010

# packaging
export DC_DEV_BACKEND = ${DC_PREFIX}-dev-backend.yml
export DC_BUILD_BACKEND = ${DC_PREFIX}-backend.yml
export DC_RUN_BACKEND = ${DC_PREFIX}-backend.yml
export FILE_BACKEND_APP_VERSION = $(APP)-$(APP_VERSION)-backend.tar.gz
export FILE_BACKEND_DIST_APP_VERSION = $(APP)-$(APP_VERSION)-backend-dist.tar.gz
export FILE_BACKEND_DIST_LATEST_VERSION = $(APP)-latest-backend-dist.tar.gz
export FILE_IMAGE_BACKEND_APP_VERSION = $(APP)-backend-$(APP_VERSION)-image.tar
export FILE_IMAGE_BACKEND_LATEST_VERSION = $(APP)-backend-latest-image.tar

export FILE_IMAGE_REDIS_APP_VERSION = $(APP)-redis-$(APP_VERSION)-image.tar
export FILE_IMAGE_REDIS_LATEST_VERSION = $(APP)-redis-latest-image.tar


##############################################
#          API reverse-proxy                 #
##############################################
export PUBLIC_BACKEND_NGINX=${APP_PATH}/public-backend-nginx
export PUBLIC_BACKEND_NGINX_LOGS=${LOGS}/public-backend-nginx
export PUBLIC_BACKEND_NGINX_SERVER_TEMPLATE_V1=nginx-run-v1.template
export PUBLIC_BACKEND_API_USER_LIMIT_RATE=1r/m
export PUBLIC_BACKEND_API_USER_BURST=3 nodelay
export PUBLIC_BACKEND_API_USER_SCOPE=http_x_forwarded_for
export PUBLIC_BACKEND_API_GLOBAL_LIMIT_RATE=5r/s
export PUBLIC_BACKEND_API_GLOBAL_BURST=20 nodelay
export PUBLIC_BACKEND_API_WRITE_LIMIT_RATE=10r/m
# packaging
export FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION = $(API)-public-backend-nginx-$(APP_VERSION)-image.tar
export FILE_IMAGE_PUBLIC_BACKEND_NGINX_LATEST_VERSION = $(API)-public-backend-nginx-latest-image.tar
export DC_RUN_NGINX_PUBLIC_BACKEND_NGINX = ${DC_PREFIX}-run-public-backend-nginx.yml


##############################################
#            public backend confs            #
##############################################

# Arbitrary uuid to let public-backend call backend api (uuid is needed) with a common UUID
export PUBLIC_BACKEND_API_UUID?=d6696bfd-4f12-42a9-9604-1378602f4ec4
export PUBLIC_BACKEND_USE_PREVIOUS_MONTH_FOR_DATA?=false
export PUBLIC_BACKEND_PREVIOUS_MONTH_SHIFT?=1

export PUBLIC_BACKEND_HOST=public-backend
export PUBLIC_BACKEND_PORT?=8020

# packaging
export DC_DEV_PUBLIC_BACKEND = ${DC_PREFIX}-dev-public-backend.yml
export DC_BUILD_PUBLIC_BACKEND = ${DC_PREFIX}-public-backend.yml
export DC_RUN_PUBLIC_BACKEND = ${DC_PREFIX}-public-backend.yml
export FILE_PUBLIC_BACKEND_APP_VERSION = $(API)-$(APP_VERSION)-public-backend.tar.gz
export FILE_PUBLIC_BACKEND_DIST_APP_VERSION = $(API)-$(APP_VERSION)-public-backend-dist.tar.gz
export FILE_PUBLIC_BACKEND_DIST_LATEST_VERSION = $(API)-latest-public-backend-dist.tar.gz
export FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION = $(API)-public-backend-$(APP_VERSION)-image.tar
export FILE_IMAGE_PUBLIC_BACKEND_LATEST_VERSION = $(API)-public-backend-latest-image.tar


##############################################
#                 test confs                 #
##############################################

# performance test confs
export PERF=${APP_PATH}/tests/performance
export PERF_IDS=${PERF}/ids.csv
export PERF_SCENARIO_V1=${PERF}/scenarios/test-histovec-v1.yml
export PERF_SCENARIO_UTAC=${PERF}/scenarios/test-histovec-v1-utac.yml
export PERF_REPORTS=${PERF}/reports/

dummy               := $(shell touch artifacts)
include ./artifacts

# combined variables should not be overrided
export CURL_OS_OPTS=-k --retry ${openstack_retry} --retry-delay ${openstack_delay} --connect-timeout ${openstack_timeout} --fail


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
ifeq ("$(wildcard /usr/bin/sha1sum /usr/local/bin/sha1sum)","")
	@echo installing sha1sum with ${INSTALL}, as needed for building targets
	@${INSTALL} md5sha1sum
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
up: up-${API_VERSION}

up-v1: network wait-elasticsearch backend-start frontend-v1
	@echo all services are up in production mode, api v1

down: down-${API_VERSION}

down-v1: frontend-stop elasticsearch-stop backend-stop network-stop
	@echo all services stopped

up-all: up

down-all: down

# production mode with fake
up-fake: network utac-fake-start smtp-fake up

down-fake: smtp-fake-stop utac-fake-stop down  # @todo: missing network-stop?

# package for production mode
build: frontend-build backend-build

build-if-necessary:
	(make backend-check-image >/dev/null 2>&1) || make backend-build
	(make nginx-check-image >/dev/null 2>&1) || make frontend-build

# @todo: est-ce qu'on s'en sert ?
build-all: build save-images

save-images: elasticsearch-save-image nginx-save-image backend-save-image redis-save-image

build-all-images: build-dir frontend-build backend-build elasticsearch-build redis-build

build-archive: clean-archive build-dir
	@echo "Build $(APP) $(APP)-$(APP_VERSION) archive"
	echo "$(APP_VERSION)" > VERSION ; cp VERSION $(BUILD_DIR)/$(APP)-VERSION
	tar -zcvf $(BUILD_DIR)/$(FILE_ARCHIVE_APP_VERSION) --exclude $$(basename $(BUILD_DIR)) --exclude nginx/*.tar.gz --exclude frontend/*.tar.gz *
	@echo "Build $(APP) $(APP)-latest archive"
	cp $(BUILD_DIR)/$(FILE_ARCHIVE_APP_VERSION) $(BUILD_DIR)/$(FILE_ARCHIVE_APP_LATEST_VERSION)

# publish packages
publish: publish-$(APP_VERSION) publish-latest

publish-$(APP_VERSION):
	@echo "Publish $(APP) $(APP_VERSION) artifacts"
	if [ -z "$(openstack_url)" -o -z "$(openstack_auth_id)" -o -z "$(openstack_token)" ] ; then exit 1 ; fi
	( cd $(BUILD_DIR) ;\
	  ls -alrt ;\
	    for file in \
                $(APP)-VERSION \
                $(FILE_ARCHIVE_APP_VERSION) \
                $(FILE_FRONTEND_DIST_APP_VERSION) \
                $(FILE_IMAGE_NGINX_APP_VERSION) \
                $(FILE_IMAGE_ELASTICSEARCH_APP_VERSION) \
                $(FILE_IMAGE_BACKEND_APP_VERSION) \
                $(FILE_IMAGE_REDIS_APP_VERSION) \
           ; do \
            curl -k -X PUT -T $$file -H 'X-Auth-Token: $(openstack_token)' $(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_APP_VERSION)/$$file ; \
           done ; \
	  curl -k -H 'X-Auth-Token: $(openstack_token)' "$(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_BASE)?prefix=${APP_VERSION}/&format=json" -s --fail | jq '.[] | [  .content_type, .hash, .last_modified , .name + ": " + (.bytes|tostring) ] | join(" ")' ; \
	)

publish-latest:
	@echo "Publish $(APP) latest artifacts"
	if [ -z "$(openstack_url)" -o -z "$(openstack_auth_id)" -o -z "$(openstack_token)" ] ; then exit 1 ; fi
	( cd $(BUILD_DIR) ;\
	    for file in \
                $(APP)-VERSION \
                $(FILE_ARCHIVE_APP_LATEST_VERSION) \
                $(FILE_FRONTEND_DIST_LATEST_VERSION) \
                $(FILE_IMAGE_NGINX_LATEST_VERSION) \
                $(FILE_IMAGE_ELASTICSEARCH_LATEST_VERSION) \
                $(FILE_IMAGE_BACKEND_LATEST_VERSION) \
                $(FILE_IMAGE_REDIS_LATEST_VERSION) \
           ; do \
            curl -k -X PUT -T $$file -H 'X-Auth-Token: $(openstack_token)' $(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_LATEST_VERSION)/$$file ; \
           done ; \
	  curl -k -H 'X-Auth-Token: $(openstack_token)' "$(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_BASE)?prefix=latest/&format=json" -s --fail | jq '.[] | [  .content_type, .hash, .last_modified , .name + ": " + (.bytes|tostring) ] | join(" ")' ; \
	)

# Download published images
download-all-images: download-all-images-${API_VERSION}
download-all-images-v1: build-dir nginx-download-image elasticsearch-download-image backend-download-image redis-download-image


# Load published images
load-all-images: load-all-images-${API_VERSION}
load-all-images-v1: build-dir nginx-load-image elasticsearch-load-image backend-load-image redis-load-image


# clean for fresh start
clean: index-purge docker-clean frontend-clean

docker-clean: stop
	docker container rm ${APP}-build-front ${APP}-nginx

clean-archive:
	@echo "Clean $(APP) archive"
	rm -rf $(FILE_ARCHIVE_APP_VERSION)

clean-image: frontend-clean-image nginx-clean-image elasticsearch-clean-image backend-clean-image

# development mode
dev: network wait-elasticsearch utac-fake-start smtp-fake backend-dev frontend-dev public-backend-dev public-backend-nginx-dev

dev-stop: elasticsearch-stop frontend-dev-stop backend-dev-stop public-backend-nginx-dev-stop public-backend-dev-stop utac-fake-stop smtp-fake-stop network-stop

dev-log:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml logs
	${DC} -f ${DC_PREFIX}-dev-backend.yml logs
	${DC} -f ${DC_PREFIX}-dev-public-backend-nginx.yml logs
	${DC} -f ${DC_PREFIX}-dev-public-backend.yml logs

# network operations
network: install-prerequisites
	@docker network create --opt com.docker.network.driver.mtu=1450 ${APP} 2> /dev/null; true

network-all: network

network-stop:
	@echo cleaning ${APP} docker network
	docker network rm ${APP}

aws:
ifeq ("$(wildcard nginx/aws-ip.conf)","")
	wget -q https://ip-ranges.amazonaws.com/ip-ranges.json -O - | jq '.prefixes[].ip_prefix' | sed 's/"/deny /;s/"/;/' > nginx/aws-ip.conf
	[ -s nginx/aws-ip.conf ] || exit 1
endif

tor:
ifeq ("$(wildcard nginx/tor-ip.conf)","")
	wget -q --no-check-certificate https://www.dan.me.uk/torlist/ -O - | sed 's/^/deny /g; s/$$/;/g' >  nginx/tor-ip.conf
	[ -s nginx/tor-ip.conf ] || exit 1
endif

git-pull:
	git pull origin dev

update: git-pull build-if-necessary up

install-cron:
	@echo installing cron in /etc/cron.d
	@echo "* * * * * ${APP_USER} /usr/bin/make -C ${APP_PATH} update" | sudo tee /etc/cron.d/${APP}

build-dir:
	if [ ! -d "$(BUILD_DIR)" ] ; then mkdir -p $(BUILD_DIR) ; fi

build-dir-clean:
	if [ -d "$(BUILD_DIR)" ] ; then rm -rf $(BUILD_DIR) ; fi


##############################################
#          RUN PUBLIC_BACKEND APP            #
##############################################

# run / stop public-backend in qualification (compiled) mode

up-public-backend: up-public-backend-${API_VERSION}

up-public-backend-v1: public-backend-start public-backend-nginx-start
	@echo all $(API) services are up in production mode, api v1

down-public-backend: down-public-backend-${API_VERSION}

down-public-backend-v1: public-backend-nginx-stop public-backend-stop
	@echo all $(API) services stopped

# build equivalent for public-backend
# JUST USE public-backend-build

build-public-backend-if-necessary:
	(make public-backend-check-image >/dev/null 2>&1) || make public-backend-build

# @todo: est-ce qu'on s'en sert ?
# build-all for public-backend
build-all-public-backend: public-backend-build public-backend-save-image

# build-all-images for public-backend
build-all-public-backend-image: build-dir public-backend-build


# build-archive for public-backend
public-backend-build-archive: public-backend-clean-archive build-dir
	@echo "Build $(API) $(API)-$(APP_VERSION) archive"
	echo "$(APP_VERSION)" > VERSION ; cp VERSION $(BUILD_DIR)/$(API)-VERSION
	tar -zcvf $(BUILD_DIR)/$(FILE_ARCHIVE_API_VERSION) --exclude public-backend-nginx/*.tar.gz --exclude $$(basename $(BUILD_DIR)) *
	@echo "Build $(APP) $(APP)-latest archive"
	cp $(BUILD_DIR)/$(FILE_ARCHIVE_API_VERSION) $(BUILD_DIR)/$(FILE_ARCHIVE_API_LATEST_VERSION)

# publish packages
publish-public-backend: publish-public-backend-$(APP_VERSION) publish-latest-public-backend

publish-public-backend-$(APP_VERSION):
	@echo "Publish $(API) $(APP_VERSION) artifacts"
	if [ -z "$(openstack_url)" -o -z "$(openstack_auth_id)" -o -z "$(openstack_token)" ] ; then exit 1 ; fi
	( cd $(BUILD_DIR) ;\
	  ls -alrt ;\
	    for file in \
                $(API)-VERSION \
                $(FILE_ARCHIVE_API_VERSION) \
                $(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION) \
                $(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION) \
           ; do \
            curl -k -X PUT -T $$file -H 'X-Auth-Token: $(openstack_token)' $(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_API_VERSION)/$$file ; \
           done ; \
	  curl -k -H 'X-Auth-Token: $(openstack_token)' "$(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_BASE)?prefix=${APP_VERSION}/&format=json" -s --fail | jq '.[] | [  .content_type, .hash, .last_modified , .name + ": " + (.bytes|tostring) ] | join(" ")' ; \
	)

publish-latest-public-backend:
	@echo "Publish $(API) latest artifacts"
	if [ -z "$(openstack_url)" -o -z "$(openstack_auth_id)" -o -z "$(openstack_token)" ] ; then exit 1 ; fi
	( cd $(BUILD_DIR) ;\
	    for file in \
                $(API)-VERSION \
                $(FILE_ARCHIVE_API_LATEST_VERSION) \
                $(FILE_IMAGE_PUBLIC_BACKEND_LATEST_VERSION) \
                $(FILE_IMAGE_PUBLIC_BACKEND_NGINX_LATEST_VERSION) \
           ; do \
            curl -k -X PUT -T $$file -H 'X-Auth-Token: $(openstack_token)' $(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_API_LATEST_VERSION)/$$file ; \
           done ; \
	  curl -k -H 'X-Auth-Token: $(openstack_token)' "$(openstack_url)/$(openstack_auth_id)/$(PUBLISH_URL_BASE)?prefix=latest/&format=json" -s --fail | jq '.[] | [  .content_type, .hash, .last_modified , .name + ": " + (.bytes|tostring) ] | join(" ")' ; \
	)

# Download published images
# download-all-images equivalent for public-backend
download-public-backend-image: download-public-backend-image-${API_VERSION}
download-public-backend-image-v1: build-dir public-backend-nginx-download-image public-backend-download-image

# Load published images
# load-all-images equivalent for public-backend
load-public-backend-image: load-public-backend-image-${API_VERSION}
load-public-backend-image-v1: build-dir public-backend-nginx-load-image public-backend-load-image

# clean-archive for public-backend
# equivalent to public-backend-clean-dist
public-backend-clean-archive:
	@echo "Clean $(API) archive"
	rm -rf $(FILE_PUBLIC_BACKEND_APP_VERSION)

# clean-image equivalent for public-backend
# JUST USE public-backend-clean-image

# development mode

# dev equivalent for public-backend
# JUST USE make dev as usual

# dev-stop equivalent for public-backend
# JUST USE make dev-stop as usual

dev-public-backend-log:
	${DC} -f ${DC_PREFIX}-dev-public-backend.yml logs

update-public-backend: git-pull build-public-backend-if-necessary up-public-backend

##############################################
#               reverse-proxy                #
#                    and                     #
#                 frontend                   #
##############################################
# production mode
nginx: frontend

nginx-stop: frontend-stop

frontend: frontend-${API_VERSION}

frontend-v1: network
	@export NGINX_SERVER_TEMPLATE=${NGINX_SERVER_TEMPLATE_V1};\
		export export EXEC_ENV=production; \
		${DC} -f $(DC_RUN_NGINX_FRONTEND) up -d 2>&1 | grep -v orphan

frontend-stop:
	@export EXEC_ENV=production; ${DC} -f $(DC_RUN_NGINX_FRONTEND) down

# build for qualification and production
frontend-build: frontend-build-unlock build-dir frontend-build-lock frontend-build-all nginx-build frontend-build-unlock

frontend-build-lock:
	@if [ -f "${FRONTEND}/.build-lock" ]; then exit 1; else touch "${FRONTEND}/.build-lock"; fi

frontend-build-unlock:
	@if [ -f "${FRONTEND}/.build-lock" ]; then rm "${FRONTEND}/.build-lock"; fi

frontend-build-all: network frontend-build-dist frontend-build-dist-archive

frontend-prepare-build:
	if [ -f "${FRONTEND}/$(FILE_FRONTEND_APP_VERSION)" ] ; then rm -rf ${FRONTEND}/$(FILE_FRONTEND_APP_VERSION) ; fi
	( cd ${FRONTEND} && tar -zcvf $(FILE_FRONTEND_APP_VERSION) --exclude ${APP}.tar.gz \
         .babelrc \
         .editorconfig \
         .eslintignore \
         .eslintrc.js \
				 vue.config.js \
         src \
         public )

frontend-check-build:
	export EXEC_ENV=build-deploy; ${DC} -f $(DC_BUILD_FRONTEND) config -q

frontend-build-dist: frontend-prepare-build frontend-check-build
	@echo building ${APP} frontend in ${FRONTEND}
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
	@( export EXEC_ENV=build-deploy && ${DC} -f $(DC_BUILD_FRONTEND) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

nginx-build: tor aws nginx-build-image-${API_VERSION}

nginx-build-image-v1: $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx-check-build tor
	@echo building ${APP} nginx
	cp $(BUILD_DIR)/$(FILE_FRONTEND_DIST_APP_VERSION) nginx/
	@export NGINX_SERVER_TEMPLATE=${NGINX_SERVER_TEMPLATE_V1};\
		export EXEC_ENV=production; \
		${DC} -f $(DC_RUN_NGINX_FRONTEND) build $(DC_BUILD_ARGS)

nginx-check-build:
	export EXEC_ENV=production;${DC} -f $(DC_RUN_NGINX_FRONTEND) config -q

nginx-save-image:
	nginx_image_name=$$(export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_FRONTEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.nginx.image') ; \
        nginx_image_name_version=$$(echo $$nginx_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker tag $$nginx_image_name $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_NGINX_APP_VERSION) $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_NGINX_LATEST_VERSION) $$nginx_image_name

nginx-check-image:
	nginx_image_name=$$(export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_FRONTEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.nginx.image') ; \
	nginx_image_name_version=$$(echo $$nginx_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker image inspect $$nginx_image_name_version

nginx-clean-image:
	@( export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_FRONTEND) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# clean build
frontend-clean:
	@echo cleaning ${APP} frontend npm dist
	sudo rm -rf ${FRONTEND}/dist

# download nginx and load it in docker
nginx-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_NGINX_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_APP_VERSION}/$(FILE_IMAGE_NGINX_APP_VERSION) \
        $(curl_progress_bar)

nginx-load-image: $(BUILD_DIR)/$(FILE_IMAGE_NGINX_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_NGINX_APP_VERSION)


# development mode
frontend-dev: network tor aws
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
	@mkdir -p ${ES_DATA}
	@chmod 777 ${ES_DATA}/.
endif
	@${DC} -f ${DC_PREFIX}-elasticsearch.yml up -d 2>&1 | grep -v orphan

elasticsearch-stop:
	${DC} -f ${DC_PREFIX}-elasticsearch.yml down

# build elasticsearch image
elasticsearch-build: elasticsearch-build-image

elasticsearch-build-image: elasticsearch-check-build
	@echo building ${APP} elasticsearch
	${DC} -f $(DC_ELASTICSEARCH) pull
	${DC} -f $(DC_ELASTICSEARCH) build $(DC_BUILD_ARGS)

elasticsearch-check-build:
	${DC} -f $(DC_ELASTICSEARCH) config -q

elasticsearch-save-image:
	elasticsearch_image_name=$$(${DC} -f $(DC_ELASTICSEARCH) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.elasticsearch.image'); \
	  docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_ELASTICSEARCH_APP_VERSION) $$elasticsearch_image_name ; \
	  docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_ELASTICSEARCH_LATEST_VERSION) $$elasticsearch_image_name

elasticsearch-clean-image:
	@( ${DC} -f $(DC_ELASTICSEARCH) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# download image and load it to docker

elasticsearch-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_ELASTICSEARCH_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_APP_VERSION}/$(FILE_IMAGE_ELASTICSEARCH_APP_VERSION) \
          $(curl_progress_bar)

elasticsearch-load-image: $(BUILD_DIR)/$(FILE_IMAGE_ELASTICSEARCH_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_ELASTICSEARCH_APP_VERSION)

# mix elasticsearch procedures
vm_max:
ifeq ("$(vm_max_count)", "")
	@if [ ${uname_S} == "Darwin" ]; then echo "WARNING: detected Darwin - vm.map_max_count=262144 settings can't be checked and correctly set. You should set it manually within your Docker virtual machine. This setting has to be set for elasticsearch."; else sudo sysctl -w vm.max_map_count=262144;fi
endif

wait-elasticsearch: elasticsearch
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET ${ES_URL}/_cat/indices > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for elasticsearch to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

# index relative operations
wait-index: index-create
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET ${ES_URL}/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for ${dataset} index - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

wait-index-purge: index-purge
	@timeout=${ES_TIMEOUT} ; ret=0 ; until [ "$$timeout" -le 1 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET ${ES_URL}/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "1" ] ; then echo "waiting for ${dataset} index to be purged - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

index-purge: wait-elasticsearch
	@docker exec ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.blocks.read_only": false}' | sed 's/{"acknowledged":true.*/${dataset} index prepared for deletion\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE ${ES_URL}/${dataset} | sed 's/{"acknowledged":true.*/${dataset} index purged\n/;s/.*no such index.*//'

index-unlock: wait-elasticsearch
	docker exec ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.blocks.read_only": false}' | sed 's/{"acknowledged":true.*/${dataset} index unlocked\n/;s/.*no such index.*//'

index-lock: wait-elasticsearch
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-create: wait-index-purge
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -H "Content-Type: application/json" -XPUT ${ES_URL}/${dataset} -d '{"settings": ${settings}, "mappings": { "${dataset}": ${mapping}}}' | sed 's/{"acknowledged":true.*/${dataset} index created with mapping\n/'

index-status: wait-elasticsearch
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET ${ES_URL}/${dataset}?pretty
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET ${ES_URL}/_cat/indices

# elasticsearch backup operations
first-backup:
	@mkdir -p ${ES_DATA_BACKUP}/`basename ${ES_DATA}` && \
		echo `date +'%Y%m%d_%H:%M'` first rsync && \
		rsync -a ${ES_DATA}/. ${ES_DATA_BACKUP}/`basename ${ES_DATA}`/.

last-backup:
	@mkdir -p ${ES_DATA_BACKUP} && \
		echo `date +'%Y%m%d_%H:%M'` last rsync && \
		rsync -a ${ES_DATA}/. ${ES_DATA_BACKUP}/`basename ${ES_DATA}`/.

post-backup:
	@echo `date +'%Y%m%d_%H:%M'` taring && \
		cd ${ES_DATA_BACKUP} && tar cf `date +%Y%m%d`_histovec.tar `basename ${ES_DATA}`/.
		echo `date +'%Y%m%d_%H:%M'` cleaning tmp dir && \
		rm -rf ${ES_DATA_BACKUP} && \
		echo `date +'%Y%m%d_%H:%M'` backup done in ${ES_DATA_BACKUP}/`date +%Y%m%d`_histovec.tar

backup: first-backup elasticsearch-stop last-backup elasticsearch post-backup


##############################################
#                 data prep                  #
##############################################
# dataprep dev mode - crypt anonymized data
# before inserting it in elasticsearch
data-encrypt: network
	@mkdir -p ${decrypted_datadir} ${datadir}
	@${DC} -f ${DC_PREFIX}-dataprep.yml up --build
	@${DC} -f ${DC_PREFIX}-dataprep.yml down

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
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET '${ES_URL}/${dataset}' | grep mapping | wc -l | awk '{print $$1}' > /dev/null
	@(find ${datadir} | egrep '${data_remote_files}.gz' | xargs cat | gunzip ) | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "decrypted " n " lines" > "/dev/stderr";} n++}' |\
	  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e 'use Digest::SHA "sha256_base64"; $$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(shift @values),0,20);print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=1;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}\n";}}' | \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" ${ES_URL}/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-check: install-prerequisites-injection wait-elasticsearch
		@(cd ${datadir} && ls | egrep '${data_remote_files}.gz' | xargs zcat | wc -l | awk '{print $$1}' && \
		(docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET '${ES_URL}/${dataset}/_search?q=*' | jq '.hits.total')) | tr '\n' ' ' | awk '{if ($$1 != $$2) {print "injection failed: wrong number of lines (swift: " $$1 " / elasticsearch: " $$2 ")" > "/dev/stderr";exit 1} else {print "number of lines is ok (swift: " $$1 " / elasticsearch: " $$2 ")"}}'

# dataprep production mode - from swift to elasticsearch
source-list:
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz'

check-rights:
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz' | wc -l

index-direct-load: install-prerequisites-injection wait-index
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz' | \
		parallel -j${ES_JOBS} '(>&2 echo {});curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "read " n " lines" > "/dev/stderr";} n++}' |\
	  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e 'use Digest::SHA "sha256_base64"; $$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(shift @values),0,20);print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=1;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}\n";}}' | \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" ${ES_URL}/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

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
					perl -e 'use Digest::SHA "sha256_base64"; $$action="'"$$action"'";$$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(shift @values),0,20);print "{\"$$action\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=1;if ($$action eq "update") {print "{ \"doc\": "} if ($$action ne "delete") {print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}";} if ($$action eq "update") {print "}\n"} elsif ($$action eq "create") {print "\n" }}}' | \
					sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
					parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" ${ES_URL}/_bulk  --data-binary @-;echo ' | \
					jq -c '.items[]' | \
					awk -v action=$$action 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{matchstr="\"result\":\""action"d\"";if ($$0 ~ matchstr) { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE_UPDATE} == 0)) {print strftime("%Y%m%d-%H:%M") " " action "d:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}} END {print strftime("%Y%m%d-%H:%M") " " action "d:" ok " rejected:" ko " end of batch"}' #| \
				done; \
		done
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT ${ES_URL}/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-direct-check: install-prerequisites-injection wait-elasticsearch
	@(curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.md5' | \
		xargs -I{} curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o - | awk 'BEGIN{n=0}{n+=$$1}END{print n}' && \
		(docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET '${ES_URL}/${dataset}/_search?q=*' | jq '.hits.total')) | tr '\n' ' ' | awk '{if ($$1 != $$2) {print "injection failed: wrong number of lines (swift: " $$1 " / elasticsearch: " $$2 ")" > "/dev/stderr";exit 1} else {print "number of lines is ok (swift: " $$1 " / elasticsearch: " $$2 ")"}}'


##############################################
#              common backend                #
##############################################
# production mode

backend-host-config: redis-host-config

redis-host-config:
ifeq ("$(wildcard ${REDIS_DATA})","")
	@echo create dummy data directory for redis
	@mkdir -p ${REDIS_DATA}
	@sudo chown 100.100 ${REDIS_DATA} || echo
endif
ifeq ("$(vm_overcommit_memory)", "")
	sudo sysctl vm.overcommit_memory=1 || echo
endif
ifeq ("$(transparent_hugepage)", "")
	echo "never" | sudo tee /sys/kernel/mm/transparent_hugepage/enabled || echo
endif

backend-build-lock:
	@if [ -f "${BACKEND}/.build-lock" ]; then exit 1; else touch "${BACKEND}/.build-lock"; fi

backend-build-unlock:
	@if [ -f "${BACKEND}/.build-lock" ]; then rm "${BACKEND}/.build-lock"; fi

backend-prepare-build:
	if [ -f "${BACKEND}/$(FILE_BACKEND_APP_VERSION)" ] ; then rm -rf ${BACKEND}/$(FILE_BACKEND_APP_VERSION) ; fi
	( cd ${BACKEND} && tar -zcvf $(FILE_BACKEND_APP_VERSION) --exclude ${APP}.tar.gz \
         babel.config.js \
         boot-dev.js \
         src \
         ecosystem.config.js )

# download image and load it in docker

redis-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_REDIS_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_APP_VERSION}/$(FILE_IMAGE_REDIS_APP_VERSION) \
          $(curl_progress_bar)
redis-load-image: $(BUILD_DIR)/$(FILE_IMAGE_REDIS_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_REDIS_APP_VERSION)

redis-build: redis-build-image

redis-build-image: redis-check-build
	@echo building ${APP} redis
	${DC} -f $(DC_RUN_BACKEND) build $(DC_BUILD_ARGS) redis

redis-check-build: backend-check-build

redis-save-image: backend-check-build
	redis_image_name=$$(${DC} -f $(DC_RUN_BACKEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.redis.image'); \
	  docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_REDIS_APP_VERSION) $$redis_image_name ; \
	  docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_REDIS_LATEST_VERSION) $$redis_image_name

##############################################
#                 backend                    #
##############################################
# production mode

backend-start: backend-host-config
	@echo docker-compose up backend for production ${VERSION}
	@export EXEC_ENV=production BACKEND_NAME=backend; ${DC} -f ${DC_PREFIX}-backend.yml up -d 2>&1 | grep -v orphan

backend-stop:
	@echo docker-compose down backend for production ${VERSION}
	@export EXEC_ENV=production BACKEND_NAME=backend; ${DC} -f ${DC_PREFIX}-backend.yml down

# package for production
backend-build: backend-build-unlock build-dir backend-build-lock backend-build-all backend-build-unlock

backend-build-all: network backend-build-dist backend-build-dist-archive backend-build-image

backend-check-build:
	export EXEC_ENV=build BACKEND_NAME=backend; ${DC} -f $(DC_BUILD_BACKEND) config -q

backend-build-dist: backend-prepare-build backend-check-build
	@echo building ${APP} backend in ${BACKEND}
	export EXEC_ENV=build BACKEND_NAME=backend; ${DC} -f $(DC_BUILD_BACKEND) build $(DC_BUILD_ARGS) backend

backend-build-dist-archive:
	export EXEC_ENV=build BACKEND_NAME=backend; ${DC} -f $(DC_BUILD_BACKEND) run -T --no-deps --rm backend tar zCcf $$(dirname /$(APP)/dist) - $$(basename /$(APP)/dist)  > $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION)
	  cp $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) $(BUILD_DIR)/$(FILE_BACKEND_DIST_LATEST_VERSION)
	if [ -f $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) ; fi
	if [ -f $(BUILD_DIR)/$(FILE_BACKEND_DIST_LATEST_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_BACKEND_DIST_LATEST_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_BACKEND_DIST_LATEST_VERSION) ; fi

backend-clean-dist:
	@rm -rf $(FILE_BACKEND_APP_VERSION)

backend-clean-dist-archive:
	@rm -rf $(FILE_BACKEND_DIST_APP_VERSION)

backend-build-image: $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) backend-check-build
	@echo building ${APP} backend image
	cp $(BUILD_DIR)/$(FILE_BACKEND_DIST_APP_VERSION) ${BACKEND}/
	export EXEC_ENV=production BACKEND_NAME=backend; ${DC} -f $(DC_RUN_BACKEND) build $(DC_BUILD_ARGS) backend

backend-save-image:
	backend_image_name=$$(export EXEC_ENV=production BACKEND_NAME=backend && ${DC} -f $(DC_RUN_BACKEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.backend.image') ; \
        backend_image_name_version=$$(echo $$backend_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker tag $$backend_image_name $$backend_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_BACKEND_APP_VERSION) $$backend_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_BACKEND_LATEST_VERSION) $$backend_image_name

backend-check-image:
	backend_image_name=$$(export EXEC_ENV=production BACKEND_NAME=backend && ${DC} -f $(DC_RUN_BACKEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services.backend.image') ; \
	backend_image_name_version=$$(echo $$backend_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
	docker image inspect $$backend_image_name_version


backend-clean-image:
	@( export EXEC_ENV=production BACKEND_NAME=backend && ${DC} -f $(DC_BUILD_BACKEND) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# download image and load it in docker

backend-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_BACKEND_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_APP_VERSION}/$(FILE_IMAGE_BACKEND_APP_VERSION) \
          $(curl_progress_bar)

backend-load-image: $(BUILD_DIR)/$(FILE_IMAGE_BACKEND_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_BACKEND_APP_VERSION)

# development mode
backend-dev: backend-host-config
	@echo docker-compose up backend for dev ${VERSION}
	@echo secret ${BACKEND_SECRET}
	@export EXEC_ENV=development BACKEND_NAME=backend;\
		${DC} -f ${DC_DEV_BACKEND} up --build -d --force-recreate 2>&1 | grep -v orphan

backend-dev-stop:
	@export EXEC_ENV=development BACKEND_NAME=backend; ${DC} -f ${DC_PREFIX}-backend.yml down


##############################################
#               reverse-proxy                #
#                    and                     #
#              public backend                #
##############################################
# production mode

public-backend-start:
	@echo docker-compose up public-backend for production ${VERSION}
	@export EXEC_ENV=production BACKEND_NAME=public-backend; ${DC} -f ${DC_PREFIX}-public-backend.yml up -d 2>&1 | grep -v orphan

public-backend-stop:
	@echo docker-compose down public-backend for production ${VERSION}
	@export EXEC_ENV=production BACKEND_NAME=public-backend; ${DC} -f ${DC_PREFIX}-public-backend.yml down

public-backend-nginx-start: network
	@echo docker-compose up public-backend-nginx for production ${VERSION}
	@export NGINX_SERVER_TEMPLATE=${PUBLIC_BACKEND_NGINX_SERVER_TEMPLATE_V1};\
		export export EXEC_ENV=production; \
		${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) up -d 2>&1 | grep -v orphan

public-backend-nginx-stop:
	@echo docker-compose down public-backend-nginx for production ${VERSION}
	@export EXEC_ENV=production; ${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) down

# package for production
public-backend-build: backend-build-unlock build-dir backend-build-lock public-backend-build-all public-backend-nginx-build backend-build-unlock

public-backend-build-all: network public-backend-build-dist public-backend-build-dist-archive public-backend-build-image

public-backend-prepare-build:
	if [ -f "${BACKEND}/$(FILE_PUBLIC_BACKEND_APP_VERSION)" ] ; then rm -rf ${BACKEND}/$(FILE_PUBLIC_BACKEND_APP_VERSION) ; fi
	( cd ${BACKEND} && tar -zcvf $(FILE_PUBLIC_BACKEND_APP_VERSION) \
         babel.config.js \
         boot-dev.js \
         src \
         ecosystem.config.js )

public-backend-check-build:
	export EXEC_ENV=build BACKEND_NAME=public-backend; ${DC} -f $(DC_BUILD_PUBLIC_BACKEND) config -q

public-backend-build-dist: public-backend-prepare-build public-backend-check-build
	@echo building ${API} in ${BACKEND}
	export EXEC_ENV=build BACKEND_NAME=public-backend; ${DC} -f $(DC_BUILD_PUBLIC_BACKEND) build $(DC_BUILD_ARGS) public-backend

public-backend-build-dist-archive:
	export EXEC_ENV=build BACKEND_NAME=public-backend; ${DC} -f $(DC_BUILD_PUBLIC_BACKEND) run -T --no-deps --rm public-backend tar zCcf $$(dirname /$(APP)/dist) - $$(basename /$(APP)/dist)  > $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION)
	  cp $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_LATEST_VERSION)
	if [ -f $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) ; fi
	if [ -f $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_LATEST_VERSION) ]; then ls -alsrt  $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_LATEST_VERSION) && sha1sum $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_LATEST_VERSION) ; fi

public-backend-clean-dist:
	@rm -rf $(FILE_PUBLIC_BACKEND_APP_VERSION)

public-backend-clean-dist-archive:
	@rm -rf $(FILE_PUBLIC_BACKEND_DIST_APP_VERSION)


public-backend-nginx-build: public-backend-nginx-build-image-${API_VERSION}

public-backend-nginx-build-image-v1: public-backend-nginx-check-build
	@echo building ${API} nginx
	@export NGINX_SERVER_TEMPLATE=${PUBLIC_BACKEND_NGINX_SERVER_TEMPLATE_V1};\
		export EXEC_ENV=production; \
		${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) build $(DC_BUILD_ARGS)

public-backend-nginx-check-build:
	export EXEC_ENV=production;${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) config -q

public-backend-nginx-save-image:
	nginx_image_name=$$(export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services."public-backend-nginx".image') ; \
        nginx_image_name_version=$$(echo $$nginx_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker tag $$nginx_image_name $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION) $$nginx_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_LATEST_VERSION) $$nginx_image_name

public-backend-nginx-check-image:
	nginx_image_name=$$(export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services."public-backend-nginx".image') ; \
	nginx_image_name_version=$$(echo $$nginx_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker image inspect $$nginx_image_name_version

public-backend-nginx-clean-image: public-backend-nginx-clean-image
	@( export EXEC_ENV=production && ${DC} -f $(DC_RUN_NGINX_PUBLIC_BACKEND_NGINX) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# download nginx and load it in docker
public-backend-nginx-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_API_VERSION}/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION) \
        $(curl_progress_bar)

public-backend-nginx-load-image: $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_NGINX_APP_VERSION)


public-backend-build-image: $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) public-backend-check-build
	@echo building ${API} image
	cp $(BUILD_DIR)/$(FILE_PUBLIC_BACKEND_DIST_APP_VERSION) ${BACKEND}/
	export EXEC_ENV=production BACKEND_NAME=public-backend; ${DC} -f $(DC_RUN_PUBLIC_BACKEND) build $(DC_BUILD_ARGS) public-backend

# save-images for public-backend
public-backend-save-image: public-backend-nginx-save-image
	backend_image_name=$$(export EXEC_ENV=production BACKEND_NAME=public-backend && ${DC} -f $(DC_RUN_PUBLIC_BACKEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services."public-backend".image') ; \
        backend_image_name_version=$$(echo $$backend_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
        docker tag $$backend_image_name $$backend_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION) $$backend_image_name_version ; \
	docker image save -o  $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_LATEST_VERSION) $$backend_image_name

public-backend-check-image: public-backend-nginx-check-image
	backend_image_name=$$(export EXEC_ENV=production BACKEND_NAME=public-backend && ${DC} -f $(DC_RUN_PUBLIC_BACKEND) config | python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | jq -r '.services."public-backend".image') ; \
	backend_image_name_version=$$(echo $$backend_image_name | sed -e "s/\(.*\):\(.*\)/\1:$(APP_VERSION)/g") ; \
	docker image inspect $$backend_image_name_version

public-backend-clean-image: public-backend-nginx-clean-image
	@( export EXEC_ENV=production BACKEND_NAME=public-backend && ${DC} -f $(DC_BUILD_PUBLIC_BACKEND) config | \
           python2 -c 'import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)' | \
           jq -r '.services[] | . as $(dollar)a | select($(dollar)a.build) | .image' ) | while read image_name ; do \
           docker rmi $$image_name || true ; \
        done

# download image and load it in docker

public-backend-download-image:
	@curl $(CURL_OS_OPTS) -s -k -X GET -o $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION) ${openstack_url}/${openstack_auth_id}/${PUBLISH_URL_API_VERSION}/$(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION) \
          $(curl_progress_bar)

public-backend-load-image: $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION)
	docker image load -i $(BUILD_DIR)/$(FILE_IMAGE_PUBLIC_BACKEND_APP_VERSION)

# development mode
public-backend-dev:
	@echo docker-compose up public-backend for dev ${VERSION}
	@echo secret ${BACKEND_SECRET}
	@export EXEC_ENV=development BACKEND_NAME=public-backend;\
		${DC} -f ${DC_DEV_PUBLIC_BACKEND} up --build -d --force-recreate 2>&1 | grep -v orphan

public-backend-dev-stop:
	@export EXEC_ENV=development BACKEND_NAME=public-backend; ${DC} -f ${DC_PREFIX}-public-backend.yml down

public-backend-nginx-dev: network
	@echo docker-compose up public-backend-nginx for dev ${VERSION}
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-dev-public-backend-nginx.yml up --build -d --force-recreate 2>&1 | grep -v orphan

public-backend-nginx-dev-stop:
	@export EXEC_ENV=development; ${DC} -f ${DC_PREFIX}-dev-public-backend-nginx.yml down

##############################################
#              fake services                 #
##############################################
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
# test production mode
test-up: test-up-${API_VERSION}
test-up-v1: wait-elasticsearch test-up-elasticsearch test-up-backend test-up-nginx test-up-$(APP)
	echo "${APP} ${APP_VERSION} up and running"
test-up-$(APP):
	time bash tests/test-up-$(APP).sh
test-up-nginx:
	time bash tests/test-up-nginx.sh
test-up-elasticsearch: wait-elasticsearch
	time bash tests/test-up-elasticsearch.sh
test-up-backend:
	time bash tests/test-up-backend.sh

# test-up for public-backend
test-up-public-backend: test-up-public-backend-nginx
	time bash tests/test-up-public-backend.sh
test-up-public-backend-nginx:
	time bash tests/test-up-public-backend-nginx.sh

# not working anymore: test requests in elasticsearch
index-test: wait-elasticsearch
	@echo index test
	@gpg --quiet --batch --yes --passphrase "${PASSPHRASE}" -d sample_data/siv.csv.gz.gpg | gunzip| awk -F ';' 'BEGIN{n=0}{n++;if (n>1){print $$1}}' | parallel -j1 'curl -s -XGET localhost:${PORT}/histovec/api/v1/id/{} ' | jq -c '{"took": .took, "hit": .hits.total}'

# performance test
test-ids:
	cd ${datadir} && ls | egrep '${data_remote_files}.gz' | xargs zcat | awk -F ';' '{print $$1;print $$2;print $$3}' | sort -R > ${PERF_IDS}

test-direct-ids:
	# warning: below, $$2 and $$3 are ida1 and ida1 as $$1 is still idv which is not injected in elasticsearch
	@curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ \
		| egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz' \
		| parallel -j${ES_JOBS} '(>&2 echo {});curl ${CURL_OS_OPTS} -s -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip \
		| awk -F ';' '{print $$2;print $$3}' | sort -R > ${PERF_IDS}

random-ids:
	@shuf ${PERF_IDS} | head -$$(( ( RANDOM % ( ( $(shell wc -l ${PERF_IDS} | awk '{print $$1}') * 10) / 100 ) )  + 1 ))  > ${PERF_IDS}.random

clean-random-ids:
	@rm ${PERF_IDS}.random

build-api-injector:
	@${DC} -f ${DC_PREFIX}-artillery.yml build

test-perf: wait-elasticsearch build-api-injector
	@echo perf test
	@for test in v1 utac; do\
		make test-perf-$$test;\
		done
	@make clean-random-ids

test-api: wait-elasticsearch build-api-injector
	@echo simple api test
	@for test in v1 utac; do\
		make test-api-$$test;\
		done
	@make clean-random-ids

test-api-dev: wait-elasticsearch build-api-injector
	@echo api dev test
	@for test in v1 utac; do\
		make test-api-dev-$$test;\
		done
	@make clean-random-ids

test-perf-v1: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_V1};\
		export PERF_TEST_ENV=api-perf;\
		make test-api-generic

test-perf-utac: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_UTAC};\
		export PERF_TEST_ENV=api-perf;\
		make test-api-generic

test-api-v1: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_V1};\
		export PERF_TEST_ENV=api;\
		make test-api-generic

test-api-utac: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_UTAC};\
		export PERF_TEST_ENV=api;\
		make test-api-generic

test-api-dev-v1: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_V1};\
		export PERF_TEST_ENV=api-dev;\
		make test-api-generic

test-api-dev-utac: random-ids
	@export PERF_SCENARIO=${PERF_SCENARIO_UTAC};\
		export PERF_TEST_ENV=api-dev;\
		make test-api-generic

test-api-generic:
	export report=reports/`basename ${PERF_SCENARIO} .yml`-${PERF_TEST_ENV}.json ;\
		${DC} -f ${DC_PREFIX}-artillery.yml run artillery run -e ${PERF_TEST_ENV} -o $${report} scenario.yml; \
		${DC} -f ${DC_PREFIX}-artillery.yml run artillery report $${report}
