/* eslint-env jasmine */
import settings from '../../src/settings'

export default function apiUrl (endpoint = '') {
  return `${settings.apiUrl}${endpoint}`
}
