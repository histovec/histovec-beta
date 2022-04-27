#######################
# Step 1: Base target #
#######################
FROM node:18.0.0-bullseye-slim as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG NPM_GIT
ARG NPM_FIX
ARG NPM_LATEST
ARG NPM_VERBOSE
ARG app_path
ARG app_name
ARG app_ver
ENV APP ${APP}
ENV APP_VERSION ${app_ver}

WORKDIR /$app_path

RUN apt-get update
RUN apt-get install python3 build-essential -y

# update debian w/proxy & mirror then installs git in case of git dependencies
RUN if [ ! -z "${NPM_GIT}" ]; then \
      echo "$http_proxy $no_proxy"; \
      (set -x && [ -z "$MIRROR_DEBIAN" ] || sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11-security|g" /etc/apt/sources.list) ; \
      apt-get update; \
      buildDeps="git"; \
      apt-get install -qy --no-install-recommends $buildDeps ; \
      git config --global url."https://".insteadOf git:// ; \
   fi

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set proxy $http_proxy --global; \
        npm config set https-proxy $https_proxy; \
        npm config set https-proxy $https_proxy --global; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "${npm_registry}" ] || npm config set registry=$npm_registry; \
   [ -z "$npm_registry" ] || npm config set strict-ssl false ; \
   [ -z "${sass_registry}" ] || npm config set sass_binary_site=$sass_registry;

# 15 min
RUN npm config set fetch-timeout 900000

RUN echo "NPM_LATEST = ${NPM_LATEST}"
RUN if [ "${NPM_LATEST}" = "true" ]; then\
    echo "Let's install npm latest version"; \
    npm i npm@latest -g;  \
  else \
    echo "Don't install npm latest version"; \
  fi

COPY package.json package-lock.json ./

RUN npm --no-git-tag-version version ${APP_VERSION}

RUN echo "NPM_VERBOSE = ${NPM_VERBOSE}"
RUN if [ "${NPM_VERBOSE}" = "true" ]; then\
    npm install --verbose;  \
  else \
     npm install; \
  fi

# RUN npm config set audit-level high
# RUN echo "NPM_FIX = ${NPM_FIX}"
# RUN if [ "${NPM_FIX}" = "true" ]; then \
#     npm audit fix --registry=https://registry.npmjs.org; \
#   else \
#     npm audit --registry=https://registry.npmjs.org; \
#   fi

COPY run.sh .
RUN chmod +x run.sh

################################
# Step 2: "development" target #
################################
FROM base as development
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ARG VITE_PORT
ENV VITE_PORT ${VITE_PORT}

VOLUME /$app_path/index.html
VOLUME /$app_path/src
VOLUME /$app_path/public

EXPOSE ${VITE_PORT}

CMD ["./run.sh", "dev"]

################################
# Step 3:   "build" target     #
################################
FROM base as build
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ENV APP ${APP}
ENV APP_VERSION ${app_ver}

VOLUME /$app_path/dist

COPY index.html vite.config.js ./
COPY src src
COPY public public


CMD ["./run.sh", "build"]

################################
# Step 4:"build-deploy" target #
################################
FROM base as build-deploy
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG sass_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ARG AB_TESTING_PERCENTAGE
ARG VITE_SOURCE_MAP
ENV APP ${app_name}
ENV APP_VERSION ${app_ver}
ENV VITE_TITLE ${app_name}
ENV VITE_AB_TESTING_PERCENTAGE ${AB_TESTING_PERCENTAGE}
ENV VITE_SOURCE_MAP ${VITE_SOURCE_MAP}

COPY ${app_name}-${app_ver}-frontend.tar.gz .

RUN env | grep VITE_ > .env

RUN cat .env

RUN  set -ex ; tar -zxvf ${app_name}-${app_ver}-frontend.tar.gz  && \
     npm run build 2>&1 | tee npm.log; egrep -E '(ERROR|error)' npm.log && exit 1 ; rm -rf npm.log \
     rm -rf ${app_name}-${app_ver}-frontend.tar.gz

CMD ["npm", "run", "build"]
