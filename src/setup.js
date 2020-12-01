import settings from './settings'

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} [customSettings] - Custom settings
 * @returns {Object} new
 */
export default function setup (customSettings) {
  if (customSettings.apiVersion == 2) {
    customSettings.apiUrl = 'https://api.evrythng.io/v2'
  } else if (customSettings.apiVersion == 1) {
    customSettings.apiUrl = 'https://api.evrythng.com'
  } else if (!customSettings.apiVersion) {
    settings.apiVersion
  } else {
    throw new Error(
      `ApiVersion ${customSettings.apiVersion} does not exist, please use apiVersion 1 or 2`
    )
  }

  return Object.assign(settings, customSettings)
}
