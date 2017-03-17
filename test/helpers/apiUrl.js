/* eslint-env jasmine */
import settings from '../../src/settings'

/**
 * Merge base apiUrl with given endpoint.
 *
 * @param {string} endpoint - Endpoint path
 * @return {string} - Full API url
 */
export default function apiUrl (endpoint = '') {
  return `${settings.apiUrl}${endpoint}`
}
