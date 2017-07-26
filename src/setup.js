import settings from './settings'

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} customSettings - Custom settings
 * @returns {Object} new
 */
export default function setup (customSettings) {
  return Object.assign(settings, customSettings)
}
