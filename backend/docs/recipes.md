# Recipes
A recipe consist of steps of treatments made on rows and colums.
The dataset is scanned by chunks, which are loaded into a Pandas dataframe.
So a recipe is basically a treatment on a chunk into a dataframe, resulting into a transformed dataframe.

A recipe can call :
- another recipe (and so one, recursively)
- generic recipes (included in the core configuration, but constructed as recipes)
- internals (map, join, eval, replace, keep, delete...) : included in the core code, can be extended
- the internal "eval" function gives access to create/modify columns based on a row function (e.g col1+col2) into recipes

## internals recipes

### map
This recipe create new columns to the dataframe, simply based on other.
```
      - map:
          matchid_date_birth_src: datasetAlpha_DATE_NAISSANCE
          matchid_date_death_src: datasetAlpha_DATE_DECES
          #location
          matchid_location:                      # in this mapping,
            - datasetAlpha_COMMUNE_NAISSANCE              # ther result will be an array
            - datasetAlpha_CODE_INSEE_NAISSANCE           # [ datasetAlpha_COMMUNE_NAISSANCE, datasetAlpha_CODE_INSEE_NAISSANCE ]
```

### eval
This is the swiss-knife recipe which evaluate a treatment row by row.
A new column value will be a value computed with a python expression.
The values of the dataframe are accessible within the `row` array.
A particular `column` value is available in `row['column'] as in `column``.

Here's an example
```
      - eval:
        - matchid_name_first: matchid_name_first_src if (type(matchid_name_first_src)==list) else [matchid_name_first_src]
        - matchid_name_last: matchid_name_last_src if (type(matchid_name_last_src)==list) else [matchid_name_last_src]
```

[Here](#eval-functions) are some of the implemented functions.


### keep
This recipe keep only columns either matching a regex, with an optional `where` condition :
```
      - keep:
          select: matchid_.*   # selection with a regexp
          where : matchid_score>0.2             #eval-like python base expression
```
or in an explicit list :
```
      - keep:
          select:              # selection by list
            - matchid_name_first
            - matchid_name_last
```

### delete
This recipe delete columns either matching regex :
```
      - delete:
          select: datasetAlpha.*    # selection with a regexp
```
or in an explicit list :
```
      - delete:
          select:              # selection by list
            - datasetAlpha_NOM_PRENOMS
            - datasetAlpha_DATE_NAISSANCE
```

### replace
This methods applies regex on a selection of fields (matching itself a regex), in python style:
```
     - replace:
          select: matchid_location_city.*         # regex for selection
          regex:                                  # ordered list of regex
            - ^\s*(lyon|marseille|paris)\s.*$: '\1'
            - montreuil s.* bois: montreuil
            - (^|\s)ste(\s|$): '\1sainte\2'
            - (^|\s)st(\s|$): '\1saint\2'
            - ^aix pce$: aix provence
```
### normalize
This methods transform a text to lowercase, removes accent and special chars on selected-by-regex fields :
```
      - normalize:
          select: matchid_location_city.*
```


### pause
This recipe is an helper for debuggin a recipe. It ends prematurely the recipe, not excecuting following steps.
Complement helpers are a selection of fields (like keep) and of top rows (head) to limit the size of the treatment.
```
      - pause:
          select: matchid_location_city.*
          head: 50
```

### to_integer
This recipe converts a selection-by-regex of columns from string to integers, "" being transformed as NaN.
```
     - to_integer:
          select: ^.*(population|surface).*$        
```

### to_float
This recipe converts a selection-by-regex of columns from string to floats, "" being transformed as NaN.
```
     - to_float:
          select: ^.*(frequency|).*$        
```


### parsedate
This recipe converts a selection-by-regex of columns from string to a date/time type :
```
      - parsedate :
          select: matchid_date_.*
          format: "%Y%m%d"               # standard python datetime format for parsing   
```


### join
This recipes acts like a SQL join, executed by chunks (so slower), tolerating fuzziness (so better).
This fuzzy join is either in-memory (for matching to small referential datasets; ie <500k) or based on elasticsearch
(for > 500k to > 100M).

** fuzzy, in-memory **

In the following example we try to match both city label (fuzzily), departement code (strictly) and country iso code (strictly) to recover citycode history of a city :

```
      - join:
          type : in_memory
          dataset: french_citycodes_fuzzy    # referential dataset to match with
          fuzzy:
            matchid_location_city_norm: norm_name
          strict:
            matchid_location_depcode: dep_code
            matchid_location_countrycode: CODEISO3
          select: # selected columns from outer dataset (right) mapped to current dataframe
            matchid_location_citycode_history: insee_code_history
            matchid_location_city: name
            matchid_location_city_geopoint_2d: geopoint_2d

```

** simple join, in-memory **
This example is more frequent and easier but useful when you have multiple referential datasets (slower than a SQL join but
can help to limits the number of in-between datasets) :
```
      - join:
          dataset: french_citycodes
          type: in_memory
          strict:
            matchid_location_citycode: insee_code
          select:
            matchid_location_citycode_history: insee_code_history
```

** large fuzzy match with elasticsearch **
This last example deals with the problem of big fuzzy match (up to millions against millions).
Of course you'll need a big cluster if you want to deal with much millions of matches in less than a week!
The fuzzy match just relies on pure elasticsearch queries transformed from json to yaml :
```
      - join:
          type: elasticsearch
          dataset: matchid
          query:
            size: 10
            query:    # the uggly raw elasticsearch query
              bool:
                must:
                  - bool:
                      should:
                        - bool:
                            must:
                              - match:
                                  matchid_name_match:
                                    query: matchid_name_last_match
                                    fuzziness: auto
                              - match:
                                  matchid_date_birth_str: matchid_date_birth_str
                        - bool:
                            must:
                              - match:
                                  matchid_name_match: matchid_name_last_match
                              - match:
                                  matchid_date_birth_str:
                                    query: matchid_date_birth_str
                                    fuzziness: 1
                      minimum_should_match: 1


```

The elasticsearch join can moreover accept some configurations :
- `unfold: False` (default `True`) - each row return a bucket of potential matches. unfold splits this buckets into rows,
  like in a SQL-join operation. if `unfold` is `Flase`, buckets are returned raw to enable custom operations.
- `keep_unmatched: True` (default: `False`) - if `unfold` is `True`, keep rows without a match (if `unfold` is `Flase`, no analysis of the bucket is done so all rows are kept)
- `unnest: False`(default: `True`) - by default, the elasticsearch values are splitted into columns;
  if `False`, the raw elasticsearch hits are returned one by row but in a column 'hit' which contains the json
- `prefix: myprefix_` (default: `hit_`) - customize prefix of the keys from the elasticsearch hits.

### unfold
This recipe split a selection-by-regex columns of arrays in to multiple rows, copying the content of the other columns :
```
     - unfold:
          select: ^hits$        
```


### unnest
This recipe split a selection-by-regex columns of JSONs in to multiple columns, one by key value of the JSON and delete previous columns
```
     - unfold:
          select: ^hits$
          prefix: hit_ #prefix with 'hit_' the keys for name the columns, default prefix is empty

```


### build_model (no chunks)
This methods applies only on a full model an should have the flag `chunked: False` in the input dataset, e.g :
```
  train_rnipp_agrippa_rescoring_model:
    input:
      dataset: rnipp_agrippa
      chunked: False    # <== this is the option to unckunk your dataset
```

To build a model, here's the way

```
      - build_model:
          model:
            name: rnipp_agrippa_ml         # the name as it will be stored in models/ et callable with "apply_model"
            library: sklearn.ensemble      # library of ml (scikit learn)
            method: RandomForestRegressor  # method of ml
            parameters:                    # kwargs of the methods
              n_estimators: 20
              max_depth: 4
              min_samples_leaf: 5
            test_size: 0.33                # split size for train and test (here 67% for training and 33% for testing)
            tries: 3                       # numbers of tries for this splitting (here 3 random splits) to test stability
          numerical: .*(hit_score.*|population|surface|matchid_hit_distance)$
          categorical: .*(matchid_location_countrycode)$
          target: validation_decision      # name of the column to predict
```



### apply_model
A model must be [built first](#build_model) or use a pre-trained model.
Models can only be applied to same data as in training, i.e. same columns in the same order.

```
      - apply_model:
          name: rnipp_agrippa_ml                                              # name of the model to be applied
          numerical: .*(hit_score.*|population|surface|matchid_hit_distance)$ # selection-by-regex of numerical columns
          categorical: .*(matchid_location_countrycode)$                      # selection-by-regex of categorical columns
          target: matchid_hit_score_ml                                        # name of the column to save prediction

```



## eval functions
### `geopoint("POINT(lon, lat")`
Maps a string `POINT(lon, lat)` to a numerical tuple `(lat,lon)`

### `distance((lat a,lon a), (lat b, lon b))`
Calculates vincenty (from geopy.distance) distance between to wgs84 (lat,lon) tuples.

### `replace_dict(object,dic)`
Replaces all values by key from dictionnary `dic` like `{"key1": "value1", "key2": "value2"}` into `object` which can be a string, a array or a dictionnary (replace into values which strictly match).


### `replace_regex(object,dic)`
Replaces all values by regex from dictionnary `dic` like `{"regex1": "value1", "regex2": "value2"}` into `object` which can be a string, a array or a dictionnary.

### `normalize(object)`
`object` may be either a string (or unicode) or an array of strings. For each string value, lower-cases the value, removes accents and special chars.

### `tokenize(object)`
`object` may be either a string (or unicode) or an array of strings. For each string value, split with \s+ separator.
nltk tokenizers could be integrated here further.

### `flatten(list)`
flattens the list, ie `[[a,b],[c]]` returns `[a,b,c]`

### `sha1(object)`
Computes the sha1 hash key of `str(object)`

### `levenshtein(str a, str b)`
Computes levenshtein distance between string a and string b.

### `levenshtein_norm(str a, str b)`
Computes normalize levenshtein distance between string a and string b.
