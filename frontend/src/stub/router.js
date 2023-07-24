const express = require('express');
const reponseRequeteApiSivParticulier200 = require('./fixtures/reponseRequeteApiSivParticulier200');
const reponseRequeteApiSivProfessionnel200 = require('./fixtures/reponseRequeteApiSivProfessionnel200');
const reponseRequeteApiIvtParticulier200 = require('./fixtures/reponseRequeteApiIvtParticulier200');
const reponseRequeteApiIvtProfessionnel200 = require('./fixtures/reponseRequeteApiIvtProfessionnel200');
const token = {
  access_token: 'access_token_bouchonne',
  };

exports.apiRouter = express.Router()
    .post('/get_token', (req, res) => {
      res.json(token)
    })
    .post('/report_by_data/siv/physique/:uuid', (req, res) => {
      res.json(reponseRequeteApiSivParticulier200);
    })
    .post('/report_by_data/siv/morale/:uuid', (req, res) => {
      res.json(reponseRequeteApiSivProfessionnel200);
    })
    .post('/report_by_data/ivt/physique/:uuid', (req, res) => {
      res.json(reponseRequeteApiIvtParticulier200);
    })
    .post('/report_by_data/ivt/morale/:uuid', (req, res) => {
      res.json(reponseRequeteApiIvtProfessionnel200);
    })
    .put('/logs/:uuid/home', (req, res) => {
      res.status(200);
    })
    .put('/logs/:uuid/search', (req, res) => {
      res.status(200);
    })
