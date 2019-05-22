const { expect } = require('chai')
const { getScope } = require('../util')

const THNG_NAME = 'E2E Test Thng'
const MIN_AGE = 120000
let operator

const getTaskThng = async () => {
  let found

  while (!found) {
    const thngs = await operator.thng().read()
    found = thngs.find(p => (p.name.includes(THNG_NAME)) && ((Date.now() - p.createdAt) < MIN_AGE))
  }

  return found
}

module.exports = () => {
  describe('Tasks', () => {
    let batch, task

    before(async () => {
      operator = getScope('operator')
      batch = await operator.batch().create({ name: 'test batch' })
    })

    after(async () => {
      // Most recent Thng is task side effect
      const thng = await getTaskThng()
      await operator.thng(thng.id).delete()

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
          thngTemplate: { name: THNG_NAME },
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
