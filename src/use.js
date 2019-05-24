import Application from './scope/Application'
import Device from './scope/Device'
import Operator from './scope/Operator'
import TrustedApplication from './scope/TrustedApplication'
import User from './scope/User'

/**
 * The items that the plugin may access and manipulate to install new functionality.
 * 
 * Think carefully before changing this contract!
 */
const API = {
  scopes: {
    Operator,
    Application,
    TrustedApplication,
    User,
    Device
  }
}

/**
 * Install a plugin, such as scanthng.js
 *
 * The plugin is provided an API object with items for it to manipulate in its
 * `install()` method, such as adding new methods to scope prototypes.
 *
 * @param {object} plugin - The plugin object, which must export the `install()` method.
 */
export default function use (plugin) {
  if (!plugin.install || typeof plugin.install !== 'function') {
    throw new Error('Plugin must export an \'install\' method')
  }

  try {
    plugin.install(API)
  } catch (e) {
    console.log('Failed to install plugin')
    console.log(e)
  }
}
