import { mixinResources } from '../util/mixin'
import Action from '../entity/Action'
import api from '../api'
import AppUser from '../entity/AppUser'
import Scope from './Scope'
import symbols from '../symbols'
import User from './User'

/** Action created on each page load automatially. **/
const ACTION_TYPE_PAGE_VISITED = '_PageVisited'

/**
 * Mixin with all the top-level Application resources.
 *
 * @mixin
 */
const ApplicationAccess = mixinResources([
  AppUser // C
])

/**
 * ActionApp is a Scope similar to Application, but with helpers for the simple
 * 'create anonymous user and actions for analytics' use case.
 *
 * @extends Scope
 * @mixes ApplicationAccess
 */
export default class ActionApp extends ApplicationAccess(Scope) {
  /**
   * Creates an instance of ActionApp.
   *
   * @param {string} apiKey - Application API Key.
   */
  constructor (apiKey) {
    super(apiKey)

    this.initPromise = super.readAccess()
      .then(access => {
        this.id = access.actor.id
        this.project = access.project
        this[symbols.path] = this._getPath()
      })
      .then(() => this.read())
      .then(() => this._getAnonUser())
      .then(anonUser => {
        this.anonUser = anonUser
      })
  }

  /**
   * Read the application's data asynchronously, then prepare the anonymous user.
   *
   * @returns {Promise}
   */
  init () {
    return this.initPromise
  }

  /**
   * Record that a page was visited. Make sure the _PageVisited action type is
   * in the application's project scope. The URL is included in customFields.
   *
   * Use evrythng.setup() to disable geolocation if preferred.
   *
   * @returns {Promise}
   */
  async pageVisited () {
    return this.createAction(ACTION_TYPE_PAGE_VISITED, { url: window.location.href })
  }

  /**
   * Helper function to create an action with extra data.
   *
   * @param {string} type - Action Type. Must exist in Application project scope.
   * @param {Object} [data] - Optional extra action data associated with the web page.
   * @param {string} thng - Thng to use as the target. Must exist in Application project scope.
   * @returns {Promise}
   */
  async createAction (type, data = {}, thng) {
    if (!this.anonUser) {
      throw new Error('Anonymous user not yet prepared. Use actionApp.init() to wait for this.')
    }

    if (type.includes('_')) {
      // Check the custom action type is visible to the user
      try {
        await this.anonUser.actionType(type).read()
      } catch (e) {
        console.error(e);
        throw new Error('The action type was not found. Is it in project scope?')
      }
    }

    const payload = { type, customFields: data }
    if (thng) {
      payload.thng = thng
    }

    return this.anonUser.action(type).create(payload)
  }

  /**
   * Get the underlyiny anonymous Application User maintained in localStorage
   * by this ActionApp.
   *
   * @returns {User} Anonymous Application User SDK Scope.
   */
  async getAnonymousUser () {
    if (!this.anonUser) {
      throw new Error('Anonymous user not yet prepared. Use actionApp.init() to wait for this.')
    }

    return this.anonUser;
  }

  // PRIVATE

  /**
   * Return application endpoint.
   *
   * @returns {string}
   * @private
   */
  _getPath () {
    return '/applications/me'
  }

  /**
   * Store each user's API key according to the app they are using.
   *
   * @returns {string} A per-app localStorage key for the user.
   */
  _getStorageKey () {
    return `action-app-user-${this.id}`
  }

  /**
   * Create a new anonymous Application User and store in localStorage.
   *
   * @returns {Promise}
   */
  async _createAnonUser () {
    const anonUser = await this.appUser().create({ anonymous: true })
    localStorage.setItem(this._getStorageKey(), anonUser.evrythngApiKey)
    return anonUser
  }

  /**
   * Get the single anonymous Application User this scope uses to create actions.
   * If none is stored in localStorage, a new one is created.
   *
   * @returns {Promise}
   */
  async _getAnonUser () {
    const apiKey = localStorage.getItem(this._getStorageKey())
    if (!apiKey) {
      return this._createAnonUser()
    }

    const anonUser = new User(apiKey)
    return anonUser.init()
  }
}
