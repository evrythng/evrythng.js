const { expect } = require('chai')
const nock = require('nock')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, url) => {
  describe('Files', () => {
    let scope, api

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(url)
    })

    it('should create a file', async () => {
      const payload = { name: 'TestFile.txt' }
      api.post('/files', payload)
        .reply(201, payload)
      const res = await scope.file().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it.only('should read all files', async () => {
      api.get('/files')
        .reply(403, {})
      const res = await scope.file().read()

      expect(res).to.be.an('array')
      expect(res).to.have.length.gte(1)
    })

    it('should read a file', async () => {
      api.get('/files/fileId')
        .reply(200, { id: 'fileId' })
      const res = await scope.file('fileId').read()

      expect(res).to.be.an('object')
      expect(res.id).to.equal('fileId')
    })

    it('should upload file content - text', async () => {
      const fileData = 'This is example text file content'

      api.get('/files/fileId')
        .reply(200, { id: 'fileId', uploadUrl: 'https://s3.amazonaws.com' })
      await scope.file('fileId').upload(fileData)

      api.get('/files/fileId')
        .reply(200, { contentUrl: 'https://s3.amazonaws.com/upload' })
      const resource = await scope.file('fileId').read()
      nock('https://s3.amazonaws.com')
        .get('/upload')
        .reply(200, fileData)
      const readData = await fetch(resource.contentUrl).then(res => res.text())

      expect(readData).to.equal(fileData)
    })

    it('should upload file content - image data')

    it.only('should delete a file', async () => {
      api.delete('/files/fileId')
        .reply(403)
      await scope.file('fileId').delete()
    })
  })
}
