# Swagger description

The backend has an auto-documented swagger description thanx to Flask-RESTPlus

If the below doc appears not to be updated, do not forget to go directly to the auto-documented swagger : `http://$servername//matchID/api/v0/# ` on your browser or :
```
curl -s -XGET http://$servername/matchID/api/v0/swagger.json
```

### API use tutorial

- to upload your files you'll have to POST them:
```
curl -s  http://$servername/web/Upload.p -F "file=@file1.csv"" -F "file=@file2.fwf"
```

### cli-way
You just have to put the files on the `upload/` directory (this path is configurable, see configuration.md).


## upload yaml configuration

To test the api, use your favorite tool. To be kind, we provide curl-generated
```
$curl -s -XGET http://localhost:8080/matchID/api/v0/recipes/
[
  "dataprep_datasetAlpha",
  "dataprep_datasetBeta",
  "matching"
]
```

Before running a recipe you first have to have a configured elasticsearch. Default provided conf supposes elasticsearch to be onto "elasticsearch:9200".
You can change it in conf/connectors/connectors.yml

Then you're ready for a first matching with the two test datasets.

```
$curl -s -XGET http://localhost:8080/matchID/api/v0/recipes/dataprep_datasetBeta/run
{
  "recipe": "dataprep_datasetBeta",
  "status": "new job"
}
```
```
$curl -XGET http://localhost:8080/matchID/api/v0/recipes/dataprep_datasetAlpha/run
{
  "recipe": "dataprep_datasetAlpha",
  "status": "new job"
}
```

The job is You now have to wait some time (~30 min w/2 CPUs and an ES cluster).
You can check the status of the job :
```
$curl -XGET http://localhost:8080/matchID/api/v0/recipes/dataprep_datasetBeta/status
{
  "recipe": "dataprep_datasetBeta",
  "status": "up"
}
```
Or you can consult the log:
```
$curl -XGET http://localhost:8080/matchID/api/v0/recipes/dataprep_datasetBeta/log
...
2017-07-21 13:20:10.291004 : run - write 8500 lines to datasetBeta_csv after recipe dataprep_datasetBeta
2017-07-21 13:20:10.297990 : run - read chunk 9000 from datasetBeta_csv with recipe dataprep_datasetBeta
2017-07-21 13:20:12.665258 : run - write 9000 lines to datasetBeta_csv after recipe dataprep_datasetBeta
2017-07-21 13:20:12.669398 : run - read chunk 9500 from datasetBeta_csv with recipe dataprep_datasetBeta
2017-07-21 13:20:17.707090 : run - write 9500 lines to datasetBeta_csv after recipe dataprep_datasetBeta
2017-07-21 13:20:17.713285 : run - read chunk 10000 from datasetBeta_csv with recipe dataprep_datasetBeta
```

Then you can stop the job :
```
$curl -XGET http://localhost:8080/matchID/api/v0/recipes/dataprep_datasetBeta/stop
{
  "recipe": "dataprep_datasetBeta",
  "status": "stopped"
}
```

Once data is inserted, you can now match mutliple identities by launching the matching recipe :
```
$curl -XGET http://localhost:8080/matchID/api/v0/recipes/matching/run
{
  "recipe": "dataprep_datasetBeta",
  "status": "up"
}
```
This one is the big step and should take 2 hours (with a 4 nodes ES)








# Global configuration

Still to be documented.
All configuration is writtend in yaml in the conf/ repository
## global
## connectors
## datasets
## recipes
## docker : architecture and scalability
