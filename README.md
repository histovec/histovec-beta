# front/back, devops and Docker

This is a start kit for developping both front and back with docker.

The aim of this repo is to help devlopping being at-first implied in a devops chain : the sooner you start in a machine-as-a code env, the faster your app will deploy.

Some stack has to be choosen here, even the components may be changed:
- proxy : nginx - could be Apache as well
- frontend : Vue.js - could be any npm framework
- backend : Python + FlaskRestPlus - could by any api framework
- database : Elasticsearch + PostGreSQL -  could be any wished stack

This is the first draft of making something quite neutral, but still derived from the matchID project. But it should take you small minutes to move it to your own playground.

# starting


Just clone the project and run dev environnement :

```
git clone https://github.com/rhanka/vue-python-docker-dev-kit
cd vue-python-docker-dev-kit
make dev
```


