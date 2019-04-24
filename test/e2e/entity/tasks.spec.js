const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Tasks', () => {
    let operator, batch, task

    before(async () => {
      operator = getScope('operator')
      batch = await operator.batch().create({ name: 'test batch' })
    })

    after(async () => {
      await operator.batch(batch.id).delete()
    })

    it('should create a task', async () => {
      const payload = {
        type: 'POPULATING',
        inputParameters: {
          type: 'FIXED_AMOUNT',
          generateThngs: true,
          generateRedirections: true,
          defaultRedirectUrl: 'https://google.com',
          thngTemplate: { name: 'Fixed Amount Task Thng' },
          shortDomain: 'tn.gg',
          quantity: 1,
          shortIdTemplate: { type: 'THNG_ID' }
        }
      }

      const res = await operator.batch(batch.id).task().create(payload, { fullResponse: true })

      expect(res).to.be.an('object')
      expect(res.status).to.equal(202)

      const taskId = res.headers.get('location').split('/').pop()
      task = await operator.batch(batch.id).task(taskId).read()

      expect(task).to.be.an('object')
      expect(task.type).to.equal(payload.type)
      expect(task.inputParameters.quantity).to.equal(payload.inputParameters.quantity)
    })

    it('should read all tasks', async () => {
      const res = await operator.batch(batch.id).task().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a task', async () => {
      const res = await operator.batch(batch.id).task(task.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(task.id)
    })
  })
}
