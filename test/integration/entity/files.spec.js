const { expect } = require('chai')
const nock = require('nock')
const { getScope, mockApi } = require('../util')

module.exports = (scopeType, settings) => {
  describe('Files', () => {
    let scope, api
    let caughtError =false

    before(() => {
      scope = getScope(scopeType)
      api = mockApi(settings.apiUrl)
    })
    if(settings.apiVersion == 1) {
    it('should create a file', async () => {
      const payload = { name: 'TestFile.txt' }
      api.post('/files', payload)
        .reply(201, payload)
      const res = await scope.file().create(payload)

      expect(res).to.be.an('object')
      expect(res.name).to.equal(payload.name)
    })

    it('should read all files', async () => {
      api.get('/files')
        .reply(200, [{ id: 'fileId' }])
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

    it('should delete a file', async () => {
      api.delete('/files/fileId')
        .reply(200)
      await scope.file('fileId').delete()
    })
  }

    if(settings.apiVersion == 2) {
      it('should create a file', async () => {
        const payload = { name: 'TestFile.txt' }
        api.post('/files', payload)
          .reply(201, payload)
        const res = await scope.file().create(payload)
  
        expect(res).to.be.an('object')
        expect(res.name).to.equal(payload.name)
      })

      it('should read a file', async () => {
        api.get('/files/fileId')
          .reply(200, { id: 'fileId' })
        const res = await scope.file('fileId').read()
  
        expect(res).to.be.an('object')
        expect(res.id).to.equal('fileId')
      })

      it('should NOT read all files', async () => {
        try {
        api.get('/files')
          .reply(403, {})
          const res = await scope.file().read()
      } catch (err) {
        caughtError = true;
        expect(err);
        }
        expect(caughtError).to.be.equal(true);
      })
  
      it('should  NOT delete a file', async () => {
        try{
        api.delete('/files/fileId')
          .reply(403)
        await scope.file('fileId').delete()
      } catch (err) {
        caughtError = true;
        expect(err);
        }
        expect(caughtError).to.be.equal(true);
      })
    }
  })
}
