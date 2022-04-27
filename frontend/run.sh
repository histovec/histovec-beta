#!/bin/bash

/usr/bin/env | egrep '^VITE_' > .env

npm run $1

