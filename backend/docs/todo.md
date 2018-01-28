# Todo

## automatization
- port to virtualenv
done :
- created docker config

## api
The swagger has still to be constructed and thus api documentation is a future achievment.
- all : use PUT and DELETE and restplus for swagger doc
- `{...}/connector/` : add path and all actions
- `{...}/recipes` : add rewrite helpers to access to input and output datasets
- `{...}/match` : simplified "match" api for the usecases
recently done:
- `{...}/conf/` : add possibility of uploading to update configuration
- all : migration to flask/restplus (facitate testing via postman collection and documentation via swagger)
- `upload/`: raw dataset upload (dataset are to be declared with a conf) and deletion
- recipe/test : return log of recipe for debug
- dataset/validation: preconfigure for matchID-validation

## core functions

### conf
- document it
done:
- create a "userspace" configuration store, uploaded via the REST api
- separed initial core objects : generic recipes, "resource datasets", which will not be "deletable" via the API (only override-able)

## recipes
- document them
- migrate listed objects (steps, regex, ...) from list to OrderedDict for cleaner yaml writing
- create recipe variables to make them more generic-able
- advanced supervising callbacks
known bugs :
- word frequency : index out of range
- es join : retry on timeout
recently done:
- added word frequency
- parallel processing of chunks
- error callbacks / return via test api for debugging


### internals
- document them
- create a python file to make it accessible for extension
- separate fold and unnest as generic internals
- sql : use pandasql to permit sql-like treatments within steps

### eval
- document it
- simplify var
- create a python file to make it accessible for extension

## connectors
- document them
- upload
- third part api (get, put)
- add mongo
- add postGreSQL

## referential datasets
- document them
- test french postcodes
- french last and first names for guesser
- cities and countries for guesser
recently done:
- french first and last name frequencies

## test dataset
- create anonymized test datasets

## Test cases
- document them

### use case
- search matches from a chunk of identities against a big already prepared dataset

### identity cases
- location : w/postcodes
- dates : supporting missing dates

## algorithms
- name guesser
- city guesser
- phonetization
- ngram
Recently done:
- geo distance
- ml : random forest

## Code refactoring
- split code
- unitary tests (at least "atomic" recipes and bug testing)
