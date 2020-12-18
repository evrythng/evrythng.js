import Scope from './Scope'
import User from './User'
import Product from '../entity/Product'
import Action from '../entity/Action'
import Place from '../entity/Place'
import AppUser from '../entity/AppUser'
import { mixinResources } from '../util/mixin'
import api from '../api'
import symbols from '../symbols'
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
  Product, // R
  Action, // C scans
  AppUser, // C
  Place // R
])

/**
 * Application is the Scope with the least permissions. It is meant to be used
 * to create and authenticate application users.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
export default class Application extends ApplicationAccess(Scope) {
  /**
   * Creates an instance of Application.
   *
   * @param {string} apiKey - API Key of scope
   * @param {Object} [data={}] - Optional application data
   */
  constructor (apiKey, data = {}) {
    super(apiKey, data)

    this.initPromise = super
      .readAccess()
      .then((access) => {
        this.id = access.actor.id
        this.project = access.project
        this[symbols.path] = this._getPath()
      })
      .then(() => this.read())
  }

  /**
   * Read the application's data asynchronously
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
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
      await userScope.init()

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
