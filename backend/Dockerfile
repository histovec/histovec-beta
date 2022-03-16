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

# update debian w/proxy & mirror
RUN echo "$http_proxy $no_proxy" && set -x && [ -z "$MIRROR_DEBIAN" ] || \
   sed -i.orig -e "s|http://deb.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11|g ; s|http://security.debian.org\([^[:space:]]*\)|$MIRROR_DEBIAN/debian11-security|g" /etc/apt/sources.list
RUN apt-get update -q

# use proxy & private npm registry
RUN if [ ! -z "$http_proxy" ] ; then \
        npm config delete proxy; \
        npm config set proxy $http_proxy; \
        npm config set proxy $http_proxy --global; \
        npm config set https-proxy $https_proxy; \
        npm config set https-proxy $https_proxy --global; \
        npm config set no-proxy $no_proxy; \
   fi ; \
   [ -z "$npm_registry" ] || npm config set registry=$npm_registry ; \
   [ -z "$npm_registry" ] || npm config set strict-ssl false

# 10 min
RUN npm config set fetch-timeout 600000

RUN echo "NPM_LATEST = ${NPM_LATEST}"
RUN if [ "${NPM_LATEST}" = "true" ]; then\
    echo "Let's install npm latest version"; \
    npm i npm@latest -g;  \
  else \
    echo "Don't install npm latest version"; \
  fi

COPY package.json ./
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
ARG file_app_version
ENV APP_VERSION ${app_ver}

COPY ${file_app_version} .

RUN  set -ex ; tar -zxvf ${file_app_version} && \
     npm run build 2>&1 | tee npm.log; egrep -E '(ERROR|error)' npm.log && exit 1 ; rm -rf npm.log \
     rm -rf ${file_app_version}

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
ARG file_dist_app_version
ARG port
ARG NPM_AUDIT_DRY_RUN
ENV NODE_ENV=production
ENV APP_VERSION=${app_ver}
# Copy the transpiled code to use in production (in /app)

COPY ${file_dist_app_version} .

RUN  [ -f ${file_dist_app_version} ] && \
     tar -zxvf ${file_dist_app_version} && \
     rm -rf ${file_dist_app_version}

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

CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]
