const fs = require('fs')
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
        type: 'text/plain',
        privateAccess: false
      }

      file = await operator.file().create(payload)

      expect(file).to.be.an('object')
      expect(file.type).to.deep.equal(payload.type)
    })

    it('should read all files', async () => {
      const res = await operator.file().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a file', async () => {
      const res = await operator.file(file.id).read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal(file.id)
    })

    it('should upload file content - text', async () => {
      const data = 'This is example text file content'

      await operator.file(file.id).upload(data)

      const resource = await operator.file(file.id).read()
      const readData = await fetch(resource.contentUrl).then(res => res.text())

      expect(readData).to.equal(data)
    })

    it('should upload file content - image data')

    it('should delete a file', async () => {
      await operator.file(file.id).delete()
    })
  })
}
