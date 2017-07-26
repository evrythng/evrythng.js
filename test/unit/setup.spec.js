/* eslint-env jasmine */
import settings from '../../src/settings'
import setup from '../../src/setup'

// Copy initial settings
const initialSettings = Object.assign({}, settings)

describe('setup', () => {
  afterEach(() => setup(initialSettings))

  it('should merge settings with custom settings', () => {
    const customSettings = {
      apiUrl: 'https://test-api.evrythng.net',
      fullResponse: true
    }
    setup(customSettings)

    expect(settings.apiUrl).toEqual(customSettings.apiUrl)
    expect(settings.fullResponse).toEqual(customSettings.fullResponse)
    expect(settings.geolocation).toEqual(initialSettings.geolocation)
  })
})
