# Data preparation

As every analyst knows, we love advanced algorithms but the main job is to clean the data first, and it is nothing really advance.
The backend should offer you all needed to prepare names, birth locations and dates, which is our main data in civil state matching.
Further pre-package recipes will be available soon for adresses, mails and phone numbers.


## meanings normalization
The main goal we follow in this **data preparation** guide is to optimize matching (**recall** ) and ranking matches (**precision**).

As your data may be from different sources, they have to make them understandable from one to each other.


There is two steps of normalization to achieve this :
- normalize column names
- normalize values

The first is to says that the column `NAME_FIRSTNAME_datasetAlpha` and `NAME_FIRSTNAME_datasetBeta` to a name, and the second that `Jean-Pierre Guérin` is the same as `JEAN PIERRE GUERIN`.

With those two steps we can consider to achieve a **semantic alignment**, or **meanings normalization**.


## columns normalization
We have to have the same language about what contains a column.
An full name is not a last name and not a first tame. A postcode is not a citycode, and a date as a string is not a computed date.
Moreover have two complementary goals :
- ** recall ** : the more normalization and categorization we have, the better is the recall. `Pierre, Jean, Guerrain` could be a possible match to `Jean-Pierre Guérin` (dependings on other fields)
- ** precision ** : we have to evaluate the credibility of a match. So `Guerin, Jean-Pierre` should be a better match than `Pierre, Jean, Guerrain` to `Jean-Pierre Guérin` - the more we have data the better will be our ranking. Here the '-' is a clue of a better ranking.

### map interesting source fields to `matchid_.*_src`
So we first have to make the difference between mapped fields, ignored fields (not needed neither for matching or ranking).
To achieve this, we'll map all interestin fields to `matchid_.*`.
To mark that the data didn't had any process change, we map the fields to columns `.*_src`.

### map names, locations and dates
Then you'll have to deal with complexity of the database modelization and the reality of identity cases.
We treat here "full french civil state" (full birth name, birth date and birth city), you'll probably have to adapt to your case.
As more data is better match, we have to organize our columns / some example
- **name**
  - `matchid_name_src` : will be a full name if in one column
  - `matchid_name_first`: will be the normalize value of the first name
  - `matchid_name_match`: will be the full-text indexed on elasticsearch for matching
  - ...
- **location**
  - `matchid_location_city_src` : the label of the city
  - `matchid_location_citycode_history`: the citycode history which will ensure maximum fidelity in city matching
  - ...
- **date**
  - `matchid_date_birth_src`: the date as in source
  - `matchid_date_birth_str`: the date in string in format %Y%m%d (19540519) for matching
  - `matchid_date_birth` : the computer-understandable datetime
- **sex**
  - `matchid_sex_src`: the civility (`Mme` ou `Mlle`ou `M`) or the gender (`F` or `M`)
  - `matchid_sex`: the normalized value `1` for male, `2`for female (as standardize by INSEE)

If you respect this patterns you'll have more reusable and sharable recipes and will accelerate your developpements.

## names
Basic normalization will be sufficient for much case.

## locations
That is : `Montreuil-sous-Bois` has to be the same as `Montreuil`, or `93048` (actual citycode),  `75048` (historic citycode), `93100` (postcode).
