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

    this.init()
  }

  /**
   * Read the application's data asynchronously, then prepare the anonymous user.
   *
   * @returns {Promise}
   */
  async init () {
    const access = await super.readAccess()
    this.id = access.actor.id
    this.project = access.project
    this[symbols.path] = this._getPath()

    await this.read()
    this.anonUser = await this._getAnonUser()
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
   * @param {object} [data] - Optional extra action data associated with the web page.
   * @returns {Promise}
   */
  async createAction (type, data = {}) {
    if (!this.anonUser) {
      throw new Error('Anonymous not yet loaded. Use ActionApp.init() to wait for this.')
    }

    // Check the action type is visible to the user
    try {
      await this.anonUser.actionType(type).read()
    } catch (e) {
      throw new Error('The action type was not found. Is it in project scope?')
    }

    return this.anonUser.action(type).create({ type, customFields: data })
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
