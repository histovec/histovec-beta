#!/bin/bash

/usr/bin/env | egrep '^VUE_APP_' > .env

npm run $1

