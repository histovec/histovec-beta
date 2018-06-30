# Histovec bêta

Cette application est la version bêta en Vue.js permettant l'édition de rapports dans le cadre de la mesure n°16 du CISR du 9 janvier 2018. Cette version vise à être mise en service au 24 mai 2018 pour une ouverture en test auprès de premiers usagers.

Il intègre trois vues:
- Home : page d'introduction du site
- Search : page de recherche pro ou particulier
- Report: page de rapport de l'historique du véhicule

## données personnelles
Les données en base sont intégralement chiffrées en AES256, et les données personnelles hashées (SHA256).

## composants
Le POC intègre les composants suivants :
- nginx
- Boostrap 3
- Vue.js 2
- Elasticsearch 6
- docker

L'environnement lance de plus un backend Python 3, mais à ce stade inutile.

## collaborez en mode développeur
```
git clone https://github.com/poc-vue
git checkout origin/dev
make build
make up
```
Les deux phases `build` et `up` permettent de construire les différents éléments (fichiers et répertoires) et structures nécessaires au fonctionnement d'Hitovec.

Pour stopper l'application, vous pouvez utiliser la commande `make down` qui arrête et supprime les conteneurs.

## changement des données

Pour charger les données (vous devez disposer du fichier `siv.csv.gz.gpg` et de la passphrase.
Copiez les données dans le répertoire `sample_data` (à créer le cas échéant).

Créer l'index et chargez les données:

```
make index-create
make index-load
```
Ce processus peut prendre un peu de temps (3 à 4 minutes pour 1M de véhicules)

Pour effacer les données :
```
make index-purge
```

## tester l'application

- rendez-vous sur : http://localhost:80
- depuis la page d'accueil,  cliquez sur "vendeur" ou "professionnel"
- sur la parge de recherche (mode "vendeur"), entrez les données de la personnes physique (nom, prénom, date de naissance) ou morale (raison sociale, n° SIREN) et les données identifiantes du véhicule (n° d'immatriculaion, n° de formule)
- vous obtenez le rapport. Cliquez sur "Transmettre le rapport" pour obtenir les liens à transmettre à l'acheteur. Celui-ci peut êre copié, envoyé par mail, sms ou QR-code.


## limitations
- seul l'environnement docker de dev fonction, la chaîne de compilation n'est pas encore constitutée
- les restitutions de la synthèse sont encore partielles
- le texte de la homepage est encore à revoir

## source
Le code a été développé en quelques heures à partir de :
https://github.com/rhanka/vue-python-docker-dev-kit
