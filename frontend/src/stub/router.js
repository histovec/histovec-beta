const express = require('express');
const reponseRequeteApiSivParticulier200 = require('./fixtures/reponseRequeteApiSivParticulier200');
const reponseRequeteApiSivProfessionnel200 = require('./fixtures/reponseRequeteApiSivProfessionnel200');
const reponseRequeteApiIvtParticulier200 = require('./fixtures/reponseRequeteApiIvtParticulier200');
const reponseRequeteApiIvtProfessionnel200 = require('./fixtures/reponseRequeteApiIvtProfessionnel200');
const token = {
  access_token: 'access_token_bouchonne',
  };
const qrCode = {
  qrCode: 'qr_code_bouchonne',
}
exports.apiRouter = express.Router()
  // *** Token ***
    .post('/get_token', (req, res) => {
      res.json(token)
    })

  // *** Rapport ***
    .post('/report_by_data/siv/physique/:uuid', (req, res) => {
      if( req.body && req.body.nom ) {
        if (req.body.nom === '404') {
          res.status(404)
        }
        if (req.body.nom === '500') {
          res.status(500)
        }
      }
      res.json(reponseRequeteApiSivParticulier200.donneesSIVParticulier);
    })
    .post('/report_by_data/siv/morale/:uuid', (req, res) => {
      if( req.body && req.body.raisonSociale ) {
        if (req.body.raisonSociale === '404') {
          res.status(404)
        }
        if (req.body.raisonSociale === '500') {
          res.status(500)
        }
      }
      res.json(reponseRequeteApiSivProfessionnel200.donneesSIVProfessionnel);
    })
    .post('/report_by_data/ivt/physique/:uuid', (req, res) => {
      if( req.body && req.body.nomPrenom ) {
        if (req.body.nomPrenom === '404') {
          res.status(404)
        }
        if (req.body.nomPrenom === '500') {
          res.status(500)
        }
      }
      res.json(reponseRequeteApiIvtParticulier200.donneesIVTParticulier);
    })
    .post('/report_by_data/ivt/morale/:uuid', (req, res) => {
      if( req.body && req.body.raisonSociale ) {
        if (req.body.raisonSociale === '404') {
          res.status(404)
        }
        if (req.body.raisonSociale === '500') {
          res.status(500)
        }
      }
      res.json(reponseRequeteApiIvtProfessionnel200.donneesIVTProfessionnel);
    })

  // *** Logs ***
    .put('/logs/:uuid/:string', (req, res) => {
      res.json(req.path);
    })
    .put('/logs/:uuid/:string/:status', (req, res) => {
     res.json(req.path);
    })

  // *** QrCode ***
    .get('/get_buyer_qrcode/:uuid/:code', (req, res) => {
      res.json(qrCode);
    })
