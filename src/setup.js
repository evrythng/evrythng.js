import isPlainObject from 'lodash-es/isPlainObject'
import settings from './settings'

/**
 * Override global settings. Ignore unknown settings.
 *
 * @param {Object} customSettings - Custom settings
 * @returns {Object} new
 */
export default function setup (customSettings) {
  if (!isPlainObject(customSettings)) {
    throw new TypeError('Setup should be called with an options object.')
  }

  // Update and return new settings.
  return Object.assign(settings, customSettings)
}
