const apiRouter = require('./router');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 5000;
const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  })
  .use('/public/v1', apiRouter.apiRouter)
  .listen(port, () => console.log(`API Stub Histovec running on port ${port}`));
