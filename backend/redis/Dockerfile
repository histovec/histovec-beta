#####################################################
#                   Redis target                    #
#####################################################
FROM redis:6-alpine as cache

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
