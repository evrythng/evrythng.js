import { expect, assert } from 'chai'
import setup from '../../src/setup'

describe('unit tests for setup.js', () => {
  it('should use default settings', async () => {
    const settings = setup({})
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.io/v2')
    expect(settings.region).to.be.equal('us')
  })
  it('should use custom apiUrl', async () => {
    const settings = setup({ apiUrl: 'google.com' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('google.com')
    expect(settings.region).to.be.equal('us')
  })
  it('should use custom apiUrl even if apiVersion is setup', async () => {
    const settings = setup({ apiVersion: 1, apiUrl: 'google.com' })
    expect(settings.apiVersion).to.be.equal(1)
    expect(settings.apiUrl).to.be.equal('google.com')
    expect(settings.region).to.be.equal('us')
  })
  it('should use custom apiUrl even if apiVersion and region are setup', async () => {
    const settings = setup({ apiVersion: 2, region: 'eu', apiUrl: 'google.com' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('google.com')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set apiUrl based on apiVersion:2  and region:eu', async () => {
    const settings = setup({ apiVersion: 2, region: 'eu' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.eu.evrythng.io/v2')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set apiUrl based on apiVersion:2  and region:us', async () => {
    const settings = setup({ apiVersion: 2, region: 'us' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.io/v2')
    expect(settings.region).to.be.equal('us')
  })
  it('should set apiUrl based on default apiVersion and region:eu', async () => {
    const settings = await setup({ region: 'eu' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.eu.evrythng.io/v2')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set apiUrl based on apiVersion:1 and region:eu', async () => {
    const settings = setup({ apiVersion: 1, region: 'eu' })
    expect(settings.apiVersion).to.be.equal(1)
    expect(settings.apiUrl).to.be.equal('https://api-eu.evrythng.com')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set apiUrl based on apiVersion:1 and region:us', async () => {
    const settings = setup({ apiVersion: 1, region: 'us' })
    expect(settings.apiVersion).to.be.equal(1)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.com')
    expect(settings.region).to.be.equal('us')
  })
  it('should throw error if apiVersion is 3', async () => {
    assert.throw(() => setup({ apiVersion: 3 }), 'Invalid apiVersion: 3. Choose from 1, 2')
  })
  it('should throw error if apiVersion is sdfsdf', async () => {
    assert.throw(
      () => setup({ apiVersion: 'sdfsdf' }),
      'Invalid apiVersion: sdfsdf. Choose from 1, 2'
    )
  })
  it('should throw error if apiVersion is null', async () => {
    assert.throw(() => setup({ apiVersion: null }), 'Invalid apiVersion: null. Choose from 1, 2')
  })
  it('should throw error if apiVersion is empty', async () => {
    assert.throw(() => setup({ apiVersion: '' }), 'Invalid apiVersion: . Choose from 1, 2')
  })
  it('should throw error if apiVersion is space', async () => {
    assert.throw(() => setup({ apiVersion: ' ' }), 'Invalid apiVersion:  . Choose from 1, 2')
  })
  it('should set up default apiVersion if apiVersion is undefined', async () => {
    const settings = await setup({ apiVersion: undefined })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.io/v2')
    expect(settings.region).to.be.equal('us')
  })
  it('should throw error if region is br', async () => {
    assert.throw(() => setup({ region: 'br' }), 'Invalid region: br. Choose from us, eu')
  })
  it('should throw error if region is number', async () => {
    assert.throw(() => setup({ region: 1 }), 'Invalid region: 1. Choose from us, eu')
  })
  it('should throw error if region is null', async () => {
    assert.throw(() => setup({ region: null }), 'Invalid region: null. Choose from us, eu')
  })
  it('should throw error if region is empty', async () => {
    assert.throw(() => setup({ region: '' }), 'Invalid region: . Choose from us, eu')
  })
  it('should throw error if region is space', async () => {
    assert.throw(() => setup({ region: ' ' }), 'Invalid region:  . Choose from us, eu')
  })
  it('should set up default region if region is undefined', async () => {
    const settings = setup({ region: undefined })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.io/v2')
    expect(settings.region).to.be.equal('us')
  })
})
