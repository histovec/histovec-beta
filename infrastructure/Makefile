##############################################
# WARNING : THIS FILE SHOULDN'T BE TOUCHED   #
#    FOR ENVIRONNEMENT CONFIGURATION         #
# CONFIGURABLE VARIABLES SHOULD BE OVERRIDED #
# IN THE 'artifacts' FILE, AS NOT COMMITTED  #
##############################################

export $openstackURL = api.swift

run:
	( \
		docker network create histovec 2> /dev/null; true ;\
		echo updating vm.max_map_count  to 262144 ;\
		sudo sysctl -w vm.max_map_count=262144 ;\
		echo creating elasticsearch data directory ;\
		mkdir -p /home/debian/histovec-dev/backend/esdata ;\
		chmod 777 /home/debian/histovec-dev/backend/esdata/. ;\
		docker-compose -f /home/debian/histovec-dev/docker-compose-elasticsearch.yml up -d ;\
		# echo "" >  nginx/tor-ip.conf ;\
		echo docker-compose up frontend for dev ;\
		docker-compose -f /home/debian/histovec-dev/docker-compose-run-frontend.yml up -d ;\
	)

local-run:
	( \
		docker network create histovec 2> /dev/null; true ;\
		echo updating vm.max_map_count  to 262144 ;\
		sudo sysctl -w vm.max_map_count=262144 ;\
		echo creating elasticsearch data directory ;\
		mkdir -p ./backend/esdata ;\
		chmod 777 ./backend/esdata/. ;\
		docker-compose -f docker-compose-elasticsearch.yml up -d  2>&1 | grep -v orphan;\
		# echo "" >  nginx/tor-ip.conf ;\
		echo docker-compose up frontend for prod ;\
		docker-compose -f docker-compose-run-frontend.yml up -d  2>&1 | grep -v orphan;\
	)

export:
	# export des images docker construites
	docker image save -o  ../histovec_export/histovec-elasticsearch.tar docker.elastic.co/elasticsearch/elasticsearch-oss:6.2.3
	docker image save -o  ../histovec_export/histovec-nginx-dev.tar nginx:latest
	# récupération des volumes
	mkdir ../histovec_export/histovec-beta
	mkdir ../histovec_export/histovec-beta/frontend
	cp -r ../histovec-beta/backend ../histovec_export/histovec-beta
	cp -r ../histovec-beta/nginx/ ../histovec_export/histovec-beta
	cp -r ../histovec-beta/frontend/dist/ ../histovec_export/histovec-beta/frontend
	cp -r ../histovec-beta/log/ ../histovec_export/histovec-beta
	cp -r ../histovec-beta/infrastructure/ ../histovec_export/histovec-beta
	cp ../histovec-beta/*.yml ../histovec_export/histovec-beta
	cp ../histovec-beta/Makefile ../histovec_export/histovec-beta
	# archive de l'arboresence
	(cd ../histovec_export/histovec-beta && tar -zcvf ../histovec-dev.tar.gz *)
	rm -rf ../histovec_export/histovec-beta
	# pré-requis swift (suppose que les credential Openstack sont renseignées viaz osHVdev)
	# echo $auth_id
	# echo $token
	# TODO: rendre générique la commande Openstack
	# export vers DML
	cd ../histovec_export
	swift --insecure --os-storage-url  https://$openstackURL/$auth_id --os-auth-token $token upload histovec-docker-images histovec-elasticsearch.tar
	swift --insecure --os-storage-url  https://$openstackURL/$auth_id --os-auth-token $token upload histovec-docker-images histovec-nginx-dev.tar
	swift --insecure --os-storage-url  https://$openstackURL/$auth_id --os-auth-token $token upload histovec-docker-images histovec-dev.tar.gz
	swift --insecure --os-storage-url  https://$openstackURL/$auth_id --os-auth-token $token list -l histovec-docker-images

local-export:
	# sauvegarde des images docker construites
	docker image save -o histovec-elasticsearch.tar docker.elastic.co/elasticsearch/elasticsearch-oss:6.2.3
	docker image save -o histovec-nginx-dev.tar nginx:latest
	# récupération des volumes
	mkdir ../histovec_export/histovec-beta
	mkdir ../histovec_export/histovec-beta/frontend
	cp -r ../histovec-beta/backend ../histovec_export/histovec-beta
	cp -r ../histovec-beta/nginx/ ../histovec_export/histovec-beta
	cp -r ../histovec-beta/frontend/dist/ ../histovec_export/histovec-beta/frontend
	cp -r ../histovec-beta/log/ ../histovec_export/histovec-beta
	cp -r ../histovec-beta/infrastructure/ ../histovec_export/histovec-beta
	cp ../histovec-beta/*.yml ../histovec_export/histovec-beta
	cp ../histovec-beta/Makefile ../histovec_export/histovec-beta
	# export vers DML
	mv histovec-elasticsearch.tar ../histovec_export/
	mv histovec-nginx-dev.tar ../histovec_export/
	# archive de l'arboresence
	(cd ../histovec_export/histovec-beta && tar -zcvf ../histovec-dev.tar.gz *)
	rm -rf ../histovec_export/histovec-beta
	ls -lah ../histovec_export

deploy:
	osHVdev stack delete --yes histovec --wait
	osHVdev stack create -t ./infrastructure/heat-templates/CIT/histovec.yml -e ./infrastructure/heat-templates/CIT/param/histovec-parameters_z1.yaml histovec

local-deploy:
	( \
		cd ../histovec_export ;\
		mkdir histovec-beta ;\
		cd histovec-beta ;\
		tar -zxvf ../histovec-dev.tar.gz ;\
		cp ../../poc-vue/Makefile .;\
		cp ../../poc-vue/infrastructure/Makefile ./infrastructure/Makefile;\
		docker load -i ../histovec-nginx-dev.tar ;\
		# docker load -i histovec-frontend-dev.tar ;\
		docker load -i ../histovec-elasticsearch.tar ;\
		# docker load -i histovec-backend.tar ;\
		# cat << 'EOF'|tee -a histovec-dev/histovec-beta/Makefile;\
		# include ./infrastructure/Makefile;\
		# EOF;\
		echo "## start histovec";\
		make local-run ;\
	)

show-images:
	${DC} -f ${DC_PREFIX}-dev-frontend.yml images
	${DC} -f ${DC_PREFIX}-elasticsearch.yml images
	${DC} -f ${DC_PREFIX}-backend.yml images
