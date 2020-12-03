import { expect } from 'chai'
import setup from '../../src/setup'

describe('unit tests for setup.js', () => {
  it('should use default settings', async () => {
    const settings = setup({})
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.us.evrythng.io/v2')
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
  it('should set url based on apiVersion:2  and region:eu', async () => {
    const settings = setup({ apiVersion: 2, region: 'eu' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.eu.evrythng.io/v2')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set url based on apiVersion:2  and region:us', async () => {
    const settings = setup({ apiVersion: 2, region: 'us' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.us.evrythng.io/v2')
    expect(settings.region).to.be.equal('us')
  })

  it('should set url based on default apiVersion and region:eu', async () => {
    const settings = await setup({ region: 'eu' })
    expect(settings.apiVersion).to.be.equal(2)
    expect(settings.apiUrl).to.be.equal('https://api.eu.evrythng.io/v2')
    expect(settings.region).to.be.equal('eu')
  })

  it('should set url based on apiVersion:1 and region:eu', async () => {
    const settings = setup({ apiVersion: 1, region: 'eu' })
    expect(settings.apiVersion).to.be.equal(1)
    expect(settings.apiUrl).to.be.equal('https://api-eu.evrythng.com')
    expect(settings.region).to.be.equal('eu')
  })
  it('should set url based on apiVersion:1 and region:us', async () => {
    const settings = setup({ apiVersion: 1, region: 'us' })
    expect(settings.apiVersion).to.be.equal(1)
    expect(settings.apiUrl).to.be.equal('https://api.evrythng.com')
    expect(settings.region).to.be.equal('us')
  })
  it('should throw error if apiVersion is 3', async () => {
    expect(() =>
      setup({ apiVersion: 3 }).to.throw(
        'ApiVersion 3 does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if apiVersion is sdfsdf', async () => {
    expect(() =>
      setup({ apiVersion: 'sdfsdf' }).to.throw(
        'ApiVersion sdfsdf does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if apiVersion is null', async () => {
    expect(() =>
      setup({ apiVersion: null }).to.throw(
        'ApiVersion null does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if apiVersion is empty', async () => {
    expect(() =>
      setup({ apiVersion: '' }).to.throw(
        'ApiVersion does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if apiVersion is space', async () => {
    expect(() =>
      setup({ apiVersion: ' ' }).to.throw(
        'ApiVersion  3 does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if apiVersion is undefined', async () => {
    expect(() =>
      setup({ apiVersion: undefined }).to.throw(
        'ApiVersion undefined does not exist, please use apiVersion "1" or "2".'
      )
    )
  })
  it('should throw error if region is br', async () => {
    expect(() =>
      setup({ region: 'br' }).to.throw('Region br does not exist, please use region "us" or "eu"')
    )
  })
  it('should throw error if region is number', async () => {
    expect(() =>
      setup({ region: 1 }).to.throw('Region 1 does not exist, please use region "us" or "eu"')
    )
  })
  it('should throw error if region is null', async () => {
    expect(() =>
      setup({ region: null }).to.throw(
        'Region null does not exist, please use region "us" or "eu"'
      )
    )
  })
  it('should throw error if region is empty', async () => {
    expect(() =>
      setup({ region: '' }).to.throw('Region  does not exist, please use region "us" or "eu"')
    )
  })
  it('should throw error if region is space', async () => {
    expect(() =>
      setup({ region: ' ' }).to.throw('Region  does not exist, please use region "us" or "eu"')
    )
  })
  it('should throw error if region is undefined', async () => {
    expect(() =>
      setup({ region: undefined }).to.throw(
        'Region undefined does not exist, please use region "us" or "eu"'
      )
    )
  })
})
