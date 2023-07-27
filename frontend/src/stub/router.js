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
      res.json(reponseRequeteApiSivParticulier200.donneesSIVParticulier);
    })
    .post('/report_by_data/siv/morale/:uuid', (req, res) => {
      res.json(reponseRequeteApiSivProfessionnel200.donneesSIVProfessionnel);
    })
    .post('/report_by_data/ivt/physique/:uuid', (req, res) => {
      res.json(reponseRequeteApiIvtParticulier200.donneesIVTParticulier);
    })
    .post('/report_by_data/ivt/morale/:uuid', (req, res) => {
      res.json(reponseRequeteApiIvtProfessionnel200.donneesIVTProfessionnel);
    })
    .put('/logs/:uuid/:string', (req, res) => {
      res.json(req.path);
    })
    .put('/logs/:uuid/:string/:status', (req, res) => {
     res.json(req.path);
    })
