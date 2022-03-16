#######################
# Step 1: Base target #
#######################
FROM node:17-bullseye-slim as base
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG MIRROR_DEBIAN
ARG NPM_FIX
ARG NPM_LATEST
ARG NPM_VERBOSE
ARG app_path
ARG app_name
ARG port

# Base dir /app
WORKDIR /$app_path

# Expose the listening port of your app
EXPOSE ${port}

# update debian w/proxy & mirror
RUN echo "$http_proxy $no_proxy" && set -x && [ -z "$MIRROR_DEBIAN" ] || \
   sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11-security|g" /etc/apt/sources.list
RUN apt-get update -q

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set https-proxy $https_proxy; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "$npm_registry" ] || npm config set registry=$npm_registry ; \
   [ -z "$npm_registry" ] || npm config set strict-ssl false

# 10 min
RUN npm config set fetch-timeout 600000

RUN [ -z "${NPM_LATEST}" ] || npm i npm@latest -g

COPY package.json ./
RUN npm --no-git-tag-version version ${APP_VERSION}
RUN if [ -z "${NPM_VERBOSE}" ]; then\
      npm install;  \
    else \
      npm install --verbose; \
    fi

# RUN if [ -z "${NPM_FIX}" ]; then \
#       npm audit --registry=https://registry.npmjs.org; \
#     else \
#       npm audit fix --registry=https://registry.npmjs.org; \
#     fi

################################
# Step 2: "development" target #
################################
FROM base as development
ARG app_ver
ARG app_path
ENV APP_VERSION ${app_ver}
ENV NPM_CONFIG_LOGLEVEL debug

VOLUME /${app_path}/src
VOLUME /${app_path}/dist

COPY babel.config.js boot-dev.js ./

CMD ["npm","run", "dev"]

##########################
# Step 3: "build" target #
##########################
FROM base as build
ENV NPM_CONFIG_LOGLEVEL warn
ARG app_name
ARG app_ver
ENV APP_VERSION ${app_ver}

COPY ${app_name}-${app_ver}-backend.tar.gz .

RUN  set -ex ; tar -zxvf ${app_name}-${app_ver}-backend.tar.gz  && \
     npm run build 2>&1 | tee npm.log; egrep -E '(ERROR|error)' npm.log && exit 1 ; rm -rf npm.log \
     rm -rf ${app_name}-${app_ver}-backend.tar.gz

CMD ["npm","run",  "build"]

###############################
# Step 4: "production" target #
###############################
FROM base as production
ARG http_proxy
ARG https_proxy
ARG no_proxy
ARG npm_registry
ARG MIRROR_DEBIAN
ARG app_path
ARG app_name
ARG app_ver
ARG port
ARG NPM_AUDIT_DRY_RUN
ENV NODE_ENV=production
ENV APP_VERSION=${app_ver}
# Copy the transpiled code to use in production (in /app)

COPY ${app_name}-${app_ver}-backend-dist.tar.gz .

RUN  [ -f "${app_name}-${app_ver}-backend-dist.tar.gz" ] && \
     tar -zxvf ${app_name}-${app_ver}-backend-dist.tar.gz  && \
     rm -rf ${app_name}-${app_ver}-backend-dist.tar.gz

COPY package.json ./

# Install production dependencies and clean cache
RUN npm --no-git-tag-version version ${APP_VERSION} && \
    npm install --production && \
    # npm config set audit-level high && \
    # npm audit --json --registry=https://registry.npmjs.org || ${NPM_AUDIT_DRY_RUN:-false} && \
    npm cache clean --force

# Install pm2
RUN npm install pm2 -g
# Copy the pm2 config
COPY ecosystem.config.js .

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production"  ]
