#####################################################
#                   Redis target                    #
#####################################################
FROM redis:6-alpine as cache
ARG redis_password

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf", "--requirepass", ${redis_password}]
