import settings from './settings'

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} [customSettings] - Custom settings
 * @returns {Object} new
 */
export default function setup (customSettings) {
  if(customSettings.apiUrl) {
      settings.apiUrl = customSettings.apiUrl
   } else if (customSettings.apiVersion == 2 ) {
    if (customSettings.regoin === 'us') {
    customSettings.apiUrl = 'https://api.us.evrythng.io/v2'}
    else if (customSettings.region === 'eu') {
      customSettings.apiUrl = 'https://api.eu.evrythng.io/v2'}
      else if (!customSettings.region) {
        settings.region
      } 
      else {
        throw new Error(
          `Region ${customSettings.region} does not exist, please use region us or eu`
        )
      }
  } else if (customSettings.apiVersion == 1) {
    if (customSettings.region === 'us') {
      customSettings.apiUrl = 'https://api.evrythng.com'}
      else if (customSettings.region === 'eu') {
        customSettings.apiUrl = 'https://api-eu.evrythng.com'}
        else if (!customSettings.region) {
          settings.region
        } 
        else {
          throw new Error(
            `Region ${customSettings.region} does not exist, please use region us or eu`
          )
        }
  } else if (!customSettings.apiVersion) {
    settings.apiVersion
  } else {
    throw new Error(
      `ApiVersion ${customSettings.apiVersion} does not exist, please use apiVersion 1 or 2`
    )
  }

  return Object.assign(settings, customSettings)
}
