import Application from './Application'
import Thng from '../entity/Thng'
import Collection from '../entity/Collection'
import ActionType from '../entity/ActionType'
import User from '../entity/User'
import ReactorSchedule from '../entity/ReactorSchedule'
import ReactorLog from '../entity/ReactorLog'
import { mixinResources } from '../util/mixin'
import api from '../api'
import isPlainObject from 'lodash-es/isPlainObject'

/**
 * E-mail and password used to create a user into the platform.
 *
 * @typedef {Object} AccessCredentials
 * @param {string} email - E-mail used on registration
 * @param {string} password - Password defined on registration
 */

/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const ApplicationAccess = mixinResources([
  Thng,             // CRUD
  Collection,       // CRUD
  ActionType,       // CR
  User,             // R
  ReactorSchedule,  // C
  ReactorLog        // C

  // From Application:
  // Product        // CRUD
  // Place          // CRUD
  // Action         // CR
])

/**
 * Application is the Scope with the least permissions. It is meant to be used
 * to create and authenticate application users.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
export default class TrustedApplication extends ApplicationAccess(Application) {
  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this.init()
  }

  /**
   * Read the trusted application's data asynchronously.
   *
   * @returns {Promise}
   */
  init () {
    // Operation is the same as for Application scope.
    return super.init()
  }

  /**
   * Login user using EVRYTHNG credentials and create User scope on success.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @param {Function} callback - Error first callback
   * @returns {Promise.<User>} - Authorized User scope
   */
  async login (credentials, callback) {
    try {
      const user = await this._authenticateUser(credentials)
      const userScope = new User(user.access.apiKey, user)
      if (callback) callback(null, userScope)
      return userScope
    } catch (err) {
      if (callback) callback(err)
      throw err
    }
  }

  // PRIVATE

  /**
   * Return application endpoint, nested within projects.
   *
   * @returns {string}
   * @private
   */
  _getPath () {
    return '/applications/me'
  }

  /**
   * Validate user credentials.
   *
   * @param {AccessCredentials} credentials - User login credentials
   * @returns {Promise.<Object>} - User details with access
   * @private
   */
  _authenticateUser (credentials) {
    if (!credentials || !isPlainObject(credentials)) {
      throw new TypeError('Credentials are missing.')
    }

    return api({
      url: '/users/login',
      method: 'post',
      data: credentials,
      apiKey: this.apiKey
    })
  }
}
