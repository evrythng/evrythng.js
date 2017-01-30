/**
 * An interceptor implements a request and/or response handlers that are called
 * before and after each request, respectively.
 *
 * @typedef {{request: function, response: function}} Interceptor
 */

/**
 * Settings can be applied globally or for individual requests.
 * Available options are provided below:
 *
 * @typedef {{apiUrl: string, url: string, method: 'string', apiKey: string, fullResponse: boolean, geolocation: boolean, timeout: number, headers: object, interceptors: {Interceptor[]}} Settings
 */

/**
 * Default settings. Never change.
 *
 * @type {Settings}
 */
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

// Initialize settings with defaults.
const settings = Object.assign({}, defaultSettings)

export default settings
