/* eslint-env jasmine */
import settings from '../../src/settings'

const defaultSettings = {
  apiUrl: 'https://api.evrythng.com',
  apiKey: '',
  fullResponse: false,
  geolocation: true,
  timeout: 0,
  headers: {
    'content-type': 'application/json'
  },
  interceptors: []
}

describe('settings', () => {
  it('should start with the default settings', () => {
    expect(settings).toEqual(defaultSettings)
  })
})
