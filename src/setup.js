import settings from './settings'

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} customSettings - Custom settings
 * @returns {Object} new
 */

/** Allowed API versions */
const VERSIONS = [1, 2]
/** Allowed API regions */
const REGIONS = ['us', 'eu']
/** Map of API URLs by version and region */
const API_MAP = {
  2: {
    us: 'https://api.evrythng.io/v2',
    eu: 'https://api.eu.evrythng.io/v2'
  },
  1: {
    us: 'https://api.evrythng.com',
    eu: 'https://api-eu.evrythng.com'
  }
}

export default function setup (newSettings = {}) {
  const { apiUrl, apiVersion = 2, region = 'us' } = newSettings

  // Validate settings
  // if (newSettings.apiVersion === undefined) {
  //   newSettings.apiVersion = 2
  // }
  // if (newSettings.region === undefined) {
  //   newSettings.region = 'us'
  // }
  if (!VERSIONS.includes(apiVersion)) {
    throw new Error(`Invalid apiVersion: ${apiVersion}. Choose from ${VERSIONS.join(', ')}`)
  }
  if (!REGIONS.includes(region)) {
    throw new Error(`Invalid region: ${region}. Choose from ${REGIONS.join(', ')}`)
  }

  // Set the API URL and region
  newSettings.apiUrl = apiUrl || API_MAP[apiVersion][region]

  return Object.assign(settings, newSettings)
}
