#!/bin/bash
#
# configuration nginx
#
#
set -e

SED_REPLACE=`env | sed -e 's#\([^=]*\)=\(.*\)\s*$#s\#<\1>\#\2\#g;#'| tr '\n' ' ' | sed 's/$/\n/'`

[ -z "${APP}" -o -z "${PUBLIC_BACKEND_HOST}" -o -z "${PUBLIC_BACKEND_PORT}" -o -z "${PUBLIC_BACKEND_API_USER_BURST}" -o -z "${PUBLIC_BACKEND_API_GLOBAL_BURST}" \
  -o -z "${PUBLIC_BACKEND_API_GLOBAL_LIMIT_RATE}" -o -z "${PUBLIC_BACKEND_API_USER_LIMIT_RATE}" -o -z "${PUBLIC_BACKEND_API_USER_SCOPE}" \
  -o -z "${PUBLIC_BACKEND_API_WRITE_LIMIT_RATE}" ] && exit 1

(
 cat /etc/nginx/conf.d/default.template | \
 sed "${SED_REPLACE}" | \
 sed "/^server {/a\
error_log /dev/stderr warn;\
access_log /dev/stdout main;
" > /etc/nginx/conf.d/default.conf
sed "${SED_REPLACE}" < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
) && nginx -g "daemon off;"
