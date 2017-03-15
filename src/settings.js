/**
 * An interceptor implements a request and/or response handlers that are called
 * before and after each request, respectively.
 *
 * @typedef {Object} Interceptor
 * @param {Function} request - Function to run before the request is sent
 * @param {Function} response - Function to run after the response is received
 */

/**
 * Settings can be applied globally or for individual requests.
 * Available options are provided below:
 *
 * @typedef {Object} Settings
 * @param {string} apiUrl - API url of request
 * @param {string} url - Url relative to `apiUrl`
 * @param {string} method - HTTP Method of request
 * @param {string} apiKey - API Key to use with request
 * @param {boolean} fullResponse - Flags if request should remain unwrapped
 * @param {boolean} geolocation - Flags if action creation should use the Web
 * Geolocation API
 * @param {number} timeout - Timeout for request
 * @param {Object} headers - Headers to send with request
 * @param {Interceptor[]} interceptors - List of request/response interceptors
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
