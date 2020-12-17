const { expect } = require('chai')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Tasks', () => {
    let scope, api

    before(async () => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a task', async () => {
      const payload = {
        type: 'POPULATING',
        inputParameters: {
          type: 'FIXED_AMOUNT',
          generateThngs: true,
          generateRedirections: true,
          defaultRedirectUrl: 'https://google.com',
          thngTemplate: { name: 'E2E Test Thng' },
          shortDomain: 'tn.gg',
          quantity: 1,
          shortIdTemplate: { type: 'THNG_ID' }
        }
      }
      api.post('/batches/batchId/tasks', payload).reply(202)
      const res = await scope.batch('batchId').task().create(payload, { fullResponse: true })

      expect(typeof res).to.equal('object')
      expect(res.status).to.equal(202)
    })

    it('should read all tasks', async () => {
      api.get('/batches/batchId/tasks').reply(200, [{ id: 'taskId' }])
      const res = await scope.batch('batchId').task().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a task', async () => {
      api.get('/batches/batchId/tasks/taskId').reply(200, { id: 'taskId' })
      const res = await scope.batch('batchId').task('taskId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('taskId')
    })
  })
}
