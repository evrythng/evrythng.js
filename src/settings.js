/**
 * An interceptor implements a request and/or response handlers that are called
 * before and after each request, respectively.
 *
 * @typedef {Object} Interceptor
 * @property {Function} request - Function to run before the request is sent
 * @property {Function} response - Function to run after the response is received
 */

/**
 * Settings can be applied globally or for individual requests.
 * Available options are provided below:
 *
 * @typedef {Object} Settings
 * @property {string} apiUrl - API url of request
 * @property {string} url - Url relative to `apiUrl`
 * @property {string} method - HTTP Method of request
 * @property {string} apiKey - API Key to use with request
 * @property {boolean} fullResponse - Flags if request should remain unwrapped
 * @property {boolean} geolocation - Flags if action creation should use the Web
 * Geolocation API
 * @property {number} timeout - Timeout for request
 * @property {Object} headers - Headers to send with request
 * @property {Interceptor[]} interceptors - List of request/response interceptors
 * @property {string} defaultShortDomain - Default short domain to use for redirections
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
  interceptors: [],
  defaultShortDomain: 'tn.gg'
}

// Initialize settings with defaults.
const settings = Object.assign({}, defaultSettings)

export default settings
