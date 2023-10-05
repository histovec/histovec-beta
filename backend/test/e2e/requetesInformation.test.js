import Lab from '@hapi/lab'
import { expect } from '@hapi/code'
import { createServer } from '../../src/server.js'
import config from '../../src/config.js';

export const lab = Lab.script()

lab.describe('GET informations', { skip: false }, () => {
  let server;

  lab.before(async () => {
    server = await createServer()
  });

  lab.after(async () => {
    await server.stop();
  });

  lab.experiment("requêtes d'informations sur l'API", () => {
    lab.it('version', async () => {
      const res = await server.inject({
        method: 'get',
        url: config.apiPrefix + '/version'
      });

      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.equal('{"version":"1.0.0"}');
    });

    lab.it('health', async () => {
      const res = await server.inject({
        method: 'get',
        url: config.apiPrefix + '/health'
      });

      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.equal('{"status":"ok"}');
    });
  })
});
