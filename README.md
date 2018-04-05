# POC Vue.js Histovec

Ceci est un premier draft quick-and-dirty intégrant la maquette réalisée au Hackathon du MI en décembre 2017 sous Boostrap.
Il intègre deux vues: 
- la recherche
- le résultat (rapport)

## composants
Le POC intègre les composants suivants :
- nginx
- Boostrap 3
- Vue.js 2
- Elasticsearch 6
- docker

L'environnement lance de plus un backend Python 3, mais à ce stade inutile.

## lancement du mode développeur
```
git clone https://github.com/histovec/poc-vue
cd poc-vue
make dev
```
Rendez-vous sur : http://localhost puis :
- entrez une plaque et un numéro VIN et appuyez sur recherche

## changement des données
Pour charger les données (vous devez disposer du fichier `siv.csv.gz.gpg` et de la passphrase.
```
make index-create
make index-load
```
pour purger l'index elasticsearch
```
make index-purge
```

## limitations
- fonction de hashage : la fonction de recherche de base à ce stade sur le hash sha1 (=> à migrer vers un sha3 ou autre fonction plus robuste), basé sur la concaténation de la plaque d'immatriculation et le numéro VIN.
- intégration de boostrap : en attendant la refonte vers Boostrap 4, les composants CSS n'ont pas été intégrés dans la chane de compilation et webpack
- seul l'environnement docker de dev fonction, la chaîne de compilation n'est pas encore constitutée
- les données de test étant partielles (en terme de champs), la fonction de recherche

## source
Le code a été développé en quelques heures à partir de :
https://github.com/rhanka/vue-python-docker-dev-kit
