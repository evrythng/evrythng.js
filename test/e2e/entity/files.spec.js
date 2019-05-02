const { expect } = require('chai')
const { getScope } = require('../util')

module.exports = () => {
  describe('Files', () => {
    let operator, file

    before(() => {
      operator = getScope('operator')
    })

    it('should create a file', async () => {
      const payload = {
        name: 'TestFile.txt',
        type: 'text/plain'
      }

      file = await operator.files().create(payload)

      expect(file).to.be.an('object')
      expect(file.type).to.deep.equal(payload.type)
    })

    it('should read all batches', async () => {
      const res = await operator.files().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a file', async () => {
      const res = await operator.files(file.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(file.id)
    })

    it('should delete a file', async () => {
      await operator.files(file.id).delete()
    })
  })
}
