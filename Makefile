##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

SHELL:=/bin/bash

export PORT=80
export APP=histovec
export COMPOSE_PROJECT_NAME=${APP}
export APP_PATH := $(shell pwd)
export APP_VERSION	:= $(shell git describe --tags || cat VERSION )
export BACKEND=${APP_PATH}/backend
export FRONTEND=${APP_PATH}/frontend
export LOGS=${APP_PATH}/log
export DC_DIR=${APP_PATH}
export DC_PREFIX=${DC_DIR}/docker-compose
export USE_TTY := $(shell test -t 1 && USE_TTY="-t")
export ES_MEM=2048m
export ES_HOST=elasticsearch
export MAX_MAP_COUNT=262144
export API_USER_LIMIT_RATE=1r/m
export API_USER_BURST=3 nodelay
export API_USER_SCOPE=http_x_forwarded_for
export API_GLOBAL_LIMIT_RATE=5r/s
export API_GLOBAL_BURST=20 nodelay


# data prep (data not included in repo)
export datadir=sample_data
export data_remote_dir=histovec-data
export data_remote_files=.*_(siv|ivt)_api_.*
export data_remote_files_inc=.*_(siv|ivt)_api-inc_.*
export datasource=${datadir}/siv.csv.gz
export datasource_crypt=${datadir}/siv.csv.gz.gpg
export datasource_json=${datadir}/siv.json.gz
export dataset=siv
export ES_CHUNK=5000
export ES_VERBOSE=100000
export ES_VERBOSE_UPDATE=1000
export ES_TIMEOUT=60
export ES_JOBS=4
export FROM=1
export stress=10
export stress_verbose=1000
export PASSPHRASE=CHANGEME
export settings={"index": {"number_of_shards": 1, "refresh_interval": "300s", "number_of_replicas": 0}}
export mapping={"_all": {"enabled": false}, "dynamic": false, "properties": {"idv": {"type": "keyword"}, "ida1": {"type": "keyword"}, "ida2": {"type": "keyword"}}}
export header="idv;ida1;ida2;v"
export index_log=${datadir}/index.log.gz

# data source
export openstack_url := $(shell echo $$openstack_url )
export openstack_auth_id := $(shell echo $$openstack_auth_id )
export openstack_token := $(shell [ -n "$$openstack_token" ] && echo $$openstack_token | tr '\n' ' ' || curl -s -k -D - -o out -L -H "Content-Type: application/json" -d '{ "auth": { "identity": { "methods": ["password"], "password": { "user": { "name": "'${OS_USERNAME}'", "domain": { "name": "'${OS_PROJECT_DOMAIN_NAME}'" }, "password": "'${OS_PASSWORD}'" } } } } }' ${OS_AUTH_URL}/auth/tokens | grep X-Subject-Token | awk '{print $$2}' )

vm_max_count		:= $(shell cat /etc/sysctl.conf 2>&1 | egrep vm.max_map_count\s*=\s*262144 && echo true)

dummy               := $(shell touch artifacts)
include ./artifacts

DC := docker-compose

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
ifeq ("$(wildcard /usr/bin/gawk /usr/local/bin/gawk)","")
	@echo installing gawk
	@sudo apt-get install -y gawk
endif
ifeq ("$(wildcard /usr/bin/jq /usr/local/bin/jq)","")
	@echo installing jq
	@sudo apt-get install -y jq
endif
ifeq ("$(wildcard /usr/bin/parallel /usr/local/bin/parallel)","")
	@echo installing parallel
	@sudo apt-get install -y parallel
endif
ifeq ("$(wildcard /usr/local/bin/docker-compose)","")
	@echo installing docker-compose
	@sudo curl -s -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
	@sudo chmod +x /usr/local/bin/docker-compose
endif

wait-elasticsearch: elasticsearch
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/_cat/indices > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for elasticsearch to start $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

wait-index: index-create
	@timeout=${ES_TIMEOUT} ; ret=1 ; until [ "$$timeout" -le 0 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "0" ] ; then echo "waiting for ${dataset} index - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret

wait-index-purge: index-purge
	@timeout=${ES_TIMEOUT} ; ret=0 ; until [ "$$timeout" -le 1 -o "$$ret" -eq "0"  ] ; do (docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s --fail -XGET localhost:9200/${dataset} > /dev/null) ; ret=$$? ; if [ "$$ret" -ne "1" ] ; then echo "waiting for ${dataset} index to be purged - $$timeout" ; fi ; ((timeout--)); sleep 1 ; done ; exit $$ret


data-download:
	@mkdir -p ${datadir}
	@curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}' | xargs -I{} curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o ${datadir}/{}

data-check:
	@cd ${datadir} && ls | egrep '${data_remote_files}.gz' | xargs md5sum | sort > checksums1
	@cd ${datadir} && ls | egrep '${data_remote_files}.md5' | xargs cat | awk '{print $$2 " " $$3}' | sort > checksums2
	@cd ${datadir} && (diff -wb checksums1 checksums2 && echo data checked) || exit 1

index-purge: wait-elasticsearch
ifeq ("$(shell docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $$1}')","1")
	@docker exec ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.blocks.read_only": false}' | sed 's/{"acknowledged":true.*/${dataset} index prepared for deletion\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/${dataset} | sed 's/{"acknowledged":true.*/${dataset} index purged\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/contact | sed 's/{"acknowledged":true.*/contact index purged\n/;s/.*no such index.*//'
	@docker exec ${APP}-elasticsearch curl -s -XDELETE localhost:9200/feedback | sed 's/{"acknowledged":true.*/feedback purged\n/;s/.*no such index.*//'
endif

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

source-list:
	@curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz'

check-rights:
	@curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz|${data_remote_files_inc}.gz' | wc -l

index-direct-load: wait-index
	@curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.gz' | \
		parallel -j${ES_JOBS} '(>&2 echo {});curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "read " n " lines" > "/dev/stderr";} n++}' |  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e 'use Digest::SHA "sha256_base64"; $$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {@values=split(/;/,$$_);$$id=substr(sha256_base64(@values[0]),0,20);print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\", \"_id\": \"$$id\"}}\n";$$i=0;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",@values))."}\n";}}' | \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'

index-direct-update: index-unlock
	@for date in `curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep "${data_remote_files_inc}" | sed 's/_.*//' | sort | uniq | sort -n`; \
		do for action in delete update create; \
			  do echo processing bulk $$action from $$date; \
					curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files_inc}.gz' | egrep $$date | egrep $$action | \
					parallel -j1 '(>&2 echo processing {});curl -s -k -H "X-Auth-Token: ${openstack_token}" ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o -' | gunzip | \
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



index-direct-check:
ifeq ("$(shell docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $$1}')","1")
	@(curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/ | egrep '${data_remote_files}.md5' | \
		xargs -I{} curl -s -k -H "X-Auth-Token: ${openstack_token}"   ${openstack_url}/${openstack_auth_id}/${data_remote_dir}/{} -o - | awk 'BEGIN{n=0}{n+=$$1}END{print n}' && \
		(docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}/_search?q=*' | jq '.hits.total')) | tr '\n' ' ' | awk '{if ($$1 != $$2) {print "injection failed: wrong number of lines" > "/dev/stderr";exit 1} else {print "number of lines is ok"}}'
endif

index-load: wait-index
ifeq ("$(wildcard ${datasource})","")
	@echo WARNING: missing data source ${datasource}
endif
ifeq ("$(shell docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $$1}')","1")
	@echo using ${zcat} as zcat
	@((find ${datadir} | egrep '${data_remote_files}.gz' | xargs cat | gunzip ) || (gpg --quiet --batch --yes --passphrase "${PASSPHRASE}" -d ${datasource_crypt} | gunzip)) | \
		awk 'BEGIN{n = 1;print "injection into elasticsearch will begin from line ${FROM}" > "/dev/stderr"; print ${header}}{if ((n == 1) || (n>=${FROM})) {print};if ((n%1000000)==0) {print "decrypted " n " lines" > "/dev/stderr";} n++}' |  perl -e 'while(<>){s/\"(.*?);(.*?)\"/\1,\2/g;print}' | perl -e '$$header=1;while(<>){ chomp;if ($$header) {@fields=split(/;/,$$_);$$header=0; }else {print "{\"index\": {\"_index\": \"'"${dataset}"'\", \"_type\": \"'"${dataset}"'\"}}\n";$$i=0;print "{".join(", ",map("\"@fields[$$i++]\": \"$$_\"",split(/;/,$$_)))."}\n";}}'| \
		sed 's/\\//g;s/""/"/g;s/ ",/ "",/g;s/"{/{/g;s/}"/}/g;s/"\[/[/g;s/\]"/]/g' | \
		parallel --block-size 10M -N ${ES_CHUNK} -j${ES_JOBS} --pipe 'docker exec -i ${APP}-elasticsearch curl -s -H "Content-Type: application/json" localhost:9200/_bulk  --data-binary @-;echo ' | \
		jq -c '.items[]' | awk 'BEGIN{ok=${FROM}-1;ko=0;lastko=""}{if ($$0 ~ "\"result\":\"created\"") { ok++ } else {ko++;lastko=$$0} if (((ok+ko)%${ES_VERBOSE} == 0)) {print strftime("%Y%m%d-%H:%M") " indexed:" ok " rejected:" ko; if (ko>0) {print "last error was : " lastko; lastko="" }}}'
	@docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XPUT localhost:9200/${dataset}/_settings -H 'content-type:application/json' -d'{"index.refresh_interval": "1s", "index.blocks.read_only": true}' | sed 's/{"acknowledged":true.*/${dataset} index locked\n/;s/.*no such index.*//'
   
endif


index-test:
ifeq ("$(shell docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $1}')","1")
	@echo index test
	@gpg --quiet --batch --yes --passphrase "${PASSPHRASE}" -d sample_data/siv.csv.gz.gpg | gunzip| awk -F ';' 'BEGIN{n=0}{n++;if (n>1){print $$1}}' | parallel -j1 'curl -s -XGET localhost:${PORT}/histovec/api/v0/id/{} ' | jq -c '{"took": .took, "hit": .hits.total}'
endif

index-stress:
ifeq ("$(shell docker exec -i ${USE_TTY} ${APP}-elasticsearch curl -s -XGET 'localhost:9200/${dataset}' | grep mapping | wc -l | awk '{print $1}')","1")
	@echo stress test
	@gpg --quiet --batch --yes --passphrase "${PASSPHRASE}" -d sample_data/siv.csv.gz.gpg | gunzip| awk -F ';' 'BEGIN{n=0;print "reading file from line ${FROM}" > "/dev/stderr"}{n++;if (n>${FROM}){print $$1}}' | parallel -j${stress} 'curl -s -XGET localhost:${PORT}/histovec/api/v0/id/{}' | jq -c -r '[.took, .hits.total] | @csv' | awk -F ',' 'BEGIN{n=0;t=0}{n++;t+=$$1;ok+=$$2;if ((n%${stress_verbose})==0) {total+=n; printf("%s with ${stress} parallel threads, total %d calls, %.0f%% hit, each response takes %.2fms\n",strftime("%Y%m%d-%H:%M"),total,ok/n*100,t/n);ok=0;t=0;n=0}}'
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
	@if [ `uname -s` = "Darwin" ];then echo detected Darwin;else sudo sysctl -w vm.max_map_count=262144;fi
endif

elasticsearch: vm_max network
ifeq ("$(wildcard ${BACKEND}/esdata/)","")
	@echo creating elasticsearch data directory
	@mkdir -p ${BACKEND}/esdata
	@chmod 777 ${BACKEND}/esdata/.
endif
	@${DC} -f ${DC_PREFIX}-elasticsearch.yml up -d 2>&1 | grep -v orphan

elasticsearch-stop:
	${DC} -f ${DC_PREFIX}-elasticsearch.yml down

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

frontend-dev: network tor
	@echo docker-compose up frontend for dev ${VERSION}
	${DC} -f ${DC_PREFIX}-dev-frontend.yml up --build -d --force-recreate 2>&1 | grep -v orphan

frontend-dev-stop:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml down

dev-log:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml logs
	${DC} -f ${DC_PREFIX}-backend.yml logs

dev: network elasticsearch frontend-dev

dev-stop: elasticsearch-stop frontend-dev-stop network-stop


frontend-build: network
	@echo building ${APP} frontend
	@echo building frontend in ${FRONTEND}
	@sudo mkdir -p ${FRONTEND}/dist-build && sudo chmod 777 ${FRONTEND}/dist-build/.
	${DC} -f ${DC_PREFIX}-build-frontend.yml up --build 2>&1 | grep -v orphan
	mkdir -p ${FRONTEND}/dist/
	@sudo rsync -avz --delete ${FRONTEND}/dist-build/. ${FRONTEND}/dist/.

build: frontend-build

update:
	git pull
	@echo building ${APP} frontend
	@echo building frontend in ${FRONTEND}
	@sudo mkdir -p ${FRONTEND}/dist-build
	${DC} -f ${DC_PREFIX}-build-frontend.yml up --build 2>&1 | grep -v orphan
	mkdir -p ${FRONTEND}/dist/
	@sudo rsync -avz --delete ${FRONTEND}/dist-build/. ${FRONTEND}/dist/.

frontend-stop:
	@${DC} -f ${DC_PREFIX}-run-frontend.yml down

frontend: network tor
	@${DC} -f ${DC_PREFIX}-run-frontend.yml up -d 2>&1 | grep -v orphan


up: network elasticsearch frontend

down: frontend-stop elasticsearch-stop network-stop
