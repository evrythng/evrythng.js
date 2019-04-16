const { expect } = require('chai');
const { api } = require('evrythng');
const { getScope } = require('../util');

const apiKey = process.env.OPERATOR_API_KEY;

const _api = (url, method = 'get', data = {}) => api({ url, method, apiKey, data });

module.exports = () => {
  describe('api', () => {
    let thng;

    it('should read access information', async () => {
      const res = await _api('/access');

      expect(res).to.be.an('object');
      expect(res.account).to.be.a('string');
      expect(res.actor.type).to.equal('operator');
    });

    it('should manipulate some resource', async () => {
      // Create
      const payload = { name: 'test' };
      thng = await _api('/thngs', 'post', payload);

      expect(thng.id).to.have.length(24);

      // Read
      thng = await _api(`/thngs/${thng.id}`);

      expect(thng.name).to.equal(payload.name);

      // Update
      payload.name = 'updated';
      thng = await _api(`/thngs/${thng.id}`, 'put', payload);

      expect(thng.name).to.equal(payload.name);
      expect(thng.createdAt).to.not.equal(thng.updatedAt);

      // Delete
      await _api(`/thngs/${thng.id}`, 'delete');
    });
  });
};
