############################
# Artillery.io load tester #
############################
FROM node:8-alpine
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name

# Base dir /app
VOLUME /artillery
WORKDIR /artillery

VOLUME /artillery/sample_data

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "$npm_registry" ] || npm config set registry=$npm_registry

RUN npm install -g artillery@1.6.0-2

COPY artillery.yml ./
CMD ["sleep", "3000"]
# CMD ["artillery","run -e development", "artillery.yml"]
