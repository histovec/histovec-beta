const express = require('express');
const reponseRequeteApiSivParticulier200 = require('../../cypress/fixtures/api/reponseRequeteApiSivParticulier200.json');
const reponseRequeteApiSivProfessionnel200 = require('../../cypress/fixtures/api/reponseRequeteApiSivProfessionnel200.json');
const reponseRequeteApiIvtParticulier200 = require('../../cypress/fixtures/api/reponseRequeteApiIvtParticulier200.json');
const reponseRequeteApiIvtProfessionnel200 = require('../../cypress/fixtures/api/reponseRequeteApiIvtProfessionnel200.json');
const path = require('path');
const {
  token,
  vehiculeNotFound,
  unauthorized,
  internalError,
} = require('./fixtures/contants.js');


function gestionErreur(incomingQuerry, res, reponse) {
  switch (incomingQuerry) {
    case '404':
      res.status(404)
      res.json(vehiculeNotFound)
      break;
    case '401':
      res.status(401)
      res.json(unauthorized)
      break;
    case '403':
      res.status(403)
      res.json(unauthorized)
      break;
    case '500':
      res.status(500)
      res.json(internalError)
      break;
    default:
      res.json(reponse);
      break;
  }
}

exports.apiRouter = express.Router()
  // *** Token ***
    .post('/get_token', (req, res) => {
      res.json(token)
    })

  // *** Rapport ***
    .post('/report_by_data/siv/physique/:uuid', (req, res) => {
      if( req.body && req.body.nom ) {
        gestionErreur(req.body.nom, res, reponseRequeteApiSivParticulier200);
      }
    })
    .post('/report_by_data/siv/morale/:uuid', (req, res) => {
      if( req.body && req.body.raisonSociale ) {
        gestionErreur(req.body.raisonSociale, res, reponseRequeteApiSivProfessionnel200);
      }
    })
    .post('/report_by_data/ivt/physique/:uuid', (req, res) => {
      if( req.body && req.body.nomPrenom ) {
        gestionErreur(req.body.nomPrenom, res, reponseRequeteApiIvtParticulier200);
      }
    })
    .post('/report_by_data/ivt/morale/:uuid', (req, res) => {
      if( req.body && req.body.raisonSociale ) {
        gestionErreur(req.body.raisonSociale, res, reponseRequeteApiIvtProfessionnel200);
      }
    })

  // *** Logs ***
    .put('/logs/:uuid/:string', (req, res) => {
      res.json({});
    })
    .put('/logs/:uuid/:string/:status', (req, res) => {
     res.json({});
    })

  // *** QrCode ***
    .get('/get_buyer_qrcode/:uuid/:code', (req, res) => {
      res.setHeader('content-type', 'image/png');
      res.sendFile(path.join(__dirname, './fixtures/qrcode.png'));
    })
