#######################
# Step 1: Base target #
#######################
FROM nginx:latest as base
ARG app_name
ARG app_ver

WORKDIR /home/nginx

COPY run.sh run.sh
COPY nginx.template /etc/nginx/nginx.template

RUN  [ -f "run.sh" ] && chmod +x run.sh

################################
# Step 2: "development" target #
################################
FROM base as development
ARG app_name
ARG app_ver

COPY nginx-dev.template /etc/nginx/conf.d/default.template

CMD ["/home/nginx/run.sh"]
################################
# Step 2: "production" target #
################################
FROM base as production
ARG app_name
ARG app_ver
ARG NGINX_SERVER_TEMPLATE

VOLUME /var/log/nginx

COPY ${NGINX_SERVER_TEMPLATE} /etc/nginx/conf.d/default.template
COPY nginx.template /etc/nginx/nginx.template

CMD ["/home/nginx/run.sh"]
