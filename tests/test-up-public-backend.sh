#!/bin/bash
#
# test de fonctionnement backend
#
set -e

basename=$(basename $0)
echo "# Start test: $basename ${APP} ${APP_VERSION}"

ret=0
container_name=public-backend-production

echo "[ENV VAR] APP = ${APP} -- (fixed at histovec)"
echo "[ENV VAR] APP_VERSION = ${APP_VERSION} -- (required)"
echo "[ENV VAR] BACKEND_PORT = ${BACKEND_PORT} -- (default is 8010)"
echo "[ENV VAR] ES_HOST = ${ES_HOST} -- (should be VM APP IP)"
echo "[ENV VAR] IS_UTAC_CACHE_IGNORABLE = ${IS_UTAC_CACHE_IGNORABLE} -- (default to false)"
echo "[ENV VAR] IS_VIN_SENT_TO_UTAC = ${IS_VIN_SENT_TO_UTAC} -- (default to true)"
echo "[ENV VAR] PUBLIC_BACKEND_PORT = ${PUBLIC_BACKEND_PORT} -- (default to 8020)"
echo "[ENV VAR] PUBLIC_BACKEND_USE_PREVIOUS_MONTH_FOR_DATA = ${PUBLIC_BACKEND_USE_PREVIOUS_MONTH_FOR_DATA} -- (default to false)"
echo "[ENV VAR] REDIS_HOST = ${REDIS_HOST} -- (should be VM APP IP)"
echo "[ENV VAR] REDIS_PASSWORD = ${REDIS_PASSWORD} -- (required)"


if [ -z "${APP}" -o -z "${APP_VERSION}" -o -z "${PUBLIC_BACKEND_PORT}" ]; then
 test_result=1
else
 test_result=0
fi
if [ "$test_result" -gt "0" ] ; then
  echo "ERROR: variable manquante: APP|APP_VERSION|PUBLIC_BACKEND_PORT"
  ret=$test_result
  exit $ret
fi

# tty or not
test -t 1 && USE_TTY="-t"

# test _cluster/health
echo "# backend-backend health"
docker exec -i ${USE_TTY} ${APP}-$container_name /bin/bash -c "curl -s --fail -XGET localhost:${PUBLIC_BACKEND_PORT}/${APP}/api/v1/health" | jq -e 'if .status then .status=="ok" else false end'
test_result=$?
if [ "$test_result" -gt "0" ] ; then
  echo "ERROR: public-backend en erreur"
  ret=$test_result
  exit $ret
fi

set -e
echo "# End test: $basename ${APP} ${APP_VERSION} status($ret)"
exit $ret
