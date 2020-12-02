const { expect } = require('chai')
const evrythng = require('../../dist/evrythng.node')

describe('e2e tests evrythng.js for apiVersion = 2', function () {
    describe('as Operator ', function () {
        it('should use default settings', async () => {
            const defaultSettings = await evrythng.setup({})
            console.log(defaultSettings)
            expect(defaultSettings.apiVersion).to.be.equal(2)
            expect(defaultSettings.apiUrl).to.be.equal('https://api.us.evrythng.io/v2')
            expect(defaultSettings.region).to.be.equal('us')
        })
    })
})