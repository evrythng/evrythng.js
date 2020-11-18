const { expect } = require('chai')
const nock = require('nock')
const { getScope, mockApi } = require('../util')

module.exports = () => {
  describe('Files', () => {
    let operator

    before(() => {
      operator = getScope('operator')
    })

    it('should create a file', async () => {
      const payload = { name: 'TestFile.txt' }
      mockApi().post('/files', payload)
        .reply(201, payload)
      const res = await operator.file().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read all files', async () => {
      mockApi().get('/files')
        .reply(200, [{ id: 'fileId' }])
      const res = await operator.file().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a file', async () => {
      mockApi().get('/files/fileId')
        .reply(200, { id: 'fileId' })
      const res = await operator.file('fileId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('fileId')
    })

    it('should upload file content - text', async function () {
      this.timeout(10000);

      const fileData = 'This is example text file content'

      mockApi().get('/files/fileId')
        .reply(200, { id: 'fileId', uploadUrl: 'https://s3.amazonaws.com' })
      await operator.file('fileId').upload(fileData)

      mockApi().get('/files/fileId')
        .reply(200, { contentUrl: 'https://s3.amazonaws.com/upload' })
      const resource = await operator.file('fileId').read()
      nock('https://s3.amazonaws.com')
        .get('/upload')
        .reply(200, fileData)
      const readData = await fetch(resource.contentUrl).then(res => res.text())

      expect(readData).to.equal(fileData)
    })

    it('should upload file content - image data')

    it('should delete a file', async () => {
      mockApi().delete('/files/fileId')
        .reply(200)
      await operator.file('fileId').delete()
    })
  })
}
