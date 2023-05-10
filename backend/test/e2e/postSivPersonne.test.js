import Lab from '@hapi/lab'
import { expect } from '@hapi/code'
import { createServer } from '../../src/server.js'
import config from '../../src/config.js';

export const lab = Lab.script()

lab.describe('POST /report_by_data/siv/personne', { skip: false }, () => {
  let server;

  lab.before(async () => {
    server = await createServer()
  });

  lab.after(async () => {
    await server.stop();
  });

  lab.experiment('récupérer information du véhicule par immat SIV et particulier', () => {
    lab.it('report_by_data', async () => {
      const datPayload = {
        uuid: "d2cbf892-0f7a-401a-8f05-f71b941d1ab8",
        particulier: {
          nom: "BLANCHET",
          prenoms: ["MARCEL"]
        },
        vehicule: {
          numero_immatriculation: "AA-948-BM",
          numero_formule: "2015CC11207"
        },
        options: {
          controles_techniques: true
        }
      }

      const res = await server.inject({
        method: 'post',
        url: config.apiPrefix + '/report_by_data/siv/personne',
        payload: datPayload
      });

      expect(res.statusCode).to.equal(200);
      const expected = '{"reponse":"OK","askControlesTechniques":true}'
      expect(res.payload).to.equal(expected);
    });
    lab.it('report_by_data', async () => {
      const datPayload = {
        uuid: "d2cbf892-0f7a-401a-8f05-f71b941d1ab8",
        particulier: {
          nom: "BLANCHET",
          prenoms: ["MARCEL"]
        },
        vehicule: {
          numero_immatriculation: "AA-948-BM",
          numero_formule: "2015CC11207"
        },
        options: {
          controles_techniques: true
        }
      }

      const res = await server.inject({
        method: 'post',
        url: config.apiPrefix + '/report_by_data/siv/personne',
        payload: datPayload
      });

      expect(res.statusCode).to.equal(200);
      // const expected = '{"vehicule":{"date_mise_a_jour":"1900-01-01","certificat_immatriculation":{"date_premiere_immatriculation":"2009-04-29","nombre_de_mois_depuis_date_emission_certificat_immatriculation":"133","numero_immatriculation_anonymisee":"BQ-9**-WK","titulaire":{"particulier":{"nom_anonymise":"M****** N*****","prenoms_anonymises":"J***-M****","code_postal":"77500"}},"caracteristiques_techniques":{"marque":"RENAULT","tvv":"BR1G0H","numero_cnit":"MRE5032EL547","nom_commercial":"CLIO","couleur":"GRIS FONCE","type_de_reception":"CE","vin_anonymise":"VF33********44551","ptta":1655,"ptac":1655,"ptra":2550,"ptes":1240,"ptav":1165,"date_emission":"2010-09-20","categorie_ue":"M1","genre_national":"VP","carrosserie_ue":"AB","carrosserie_fr":"CI","numero_de_reception":"e2*2001/116*0327*23","cylindree":1461,"puissance_nette":50,"energie":"GO","puissance_cv":4,"rapport_puissance_masse":0,"places_assises":5,"places_debout":0,"niveau_sonore":79,"vitesse_du_moteur":3000,"emission_co2":120,"classe_environnementale_ue":"70/220*2003/76EURO4"},"etat":{"duplicata":false,"annule":false,"perdu":false,"vole":false}},"etat":{"nombre_de_titulaires":2,"vole":false,"procedures_ve":{"numero_immatriculation_au_format_fni":false,"date_derniere_procedure_ve":"2013-08-02","apte_a_circuler":false,"nombre_de_procedures_ve":1,"procedure_ve_en_cours":false},"vehicule_a_usage_agricole":false,"vehicule_a_usage_de_collection":false},"historique":[{"date":"2014-09-16","type":"REIMMAT_ETRANGER"},{"date":"2013-11-06","type":"DECLARATION_CESSION"},{"date":"2013-10-15","type":"DECLARATION_ACHAT"},{"date":"2013-10-04","type":"DECLARATION_CESSION"},{"date":"2013-10-04","type":"DECLARATION_ACHAT"},{"date":"2013-08-08","type":"PREM_RAP_VE"},{"date":"2013-08-02","type":"DEC_VE"},{"date":"2010-09-20","type":"CHANG_TIT_NORMAL"},{"date":"2010-04-23","type":"DECLARATION_ACHAT"},{"date":"2009-04-29","type":"IMMAT_NORMALE"}],"import_en_france":{"vehicule_importe_depuis_etranger":false,"date_import":"2009-04-29"},"situation_administrative":{"declarations_valant_saisie":[],"gages":[],"opposition":{"oves":[],"oveis":[],"otcis":[],"otcis_pv":[]},"suspensions":[{"date":"2013-08-01","motif":"PVE","remise_du_titre":false,"retrait_du_titre":false},{"date":"2014-05-03","motif":"REI","remise_du_titre":false,"retrait_du_titre":false}]},"extra":{}},"controles_techniques":{"historique":[],"donnee_disponible":true}}'
      const expected = '{"reponse":"OK","askControlesTechniques":true}'
      expect(res.payload).to.equal(expected);
    });
  })
});
