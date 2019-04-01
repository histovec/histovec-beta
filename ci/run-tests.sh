#!/bin/bash
basename=$(basename $0)
ret=1
echo "# build all/run/test all"
time make -f Makefile.deploy build-all-images || exit $?
time make -f Makefile.deploy up-all || exit $?
# create test env
time make -f Makefile.deploy wait-elasticsearch || exit $?
time make -f Makefile.deploy index-create || exit $?
time make -f Makefile.deploy index-status || exit $?
time make -f Makefile.deploy test-up || exit $?
# teardown
time make -f Makefile.deploy down-all || exit $?

