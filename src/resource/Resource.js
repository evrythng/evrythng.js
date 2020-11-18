import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'
import Scope from '../scope/Scope'
import Entity from '../entity/Entity'
import api from '../api'

import { success, failure } from '../util/callback'
import symbols from '../symbols'
import parseLinkHeader from '../util/parseLinkHeader'
// import ensureSupportedScopeForApiVersionV2 from '../util/ensureSupportedScope'

/**
 * A Resource is the base class that implements the CRUD methods behavior.
 * All resource requests are scoped (i.e. they use the scope's API Key).
 *
 * Every resource operation tries to serialize/deserialize the type of object
 * corresponding to the resource (i.e. when creating a Thng, the developer gets
 * a Thng entity back, with nested methods).
 */
export default class Resource {
  /**
   * Returns a resource factory function for the given entity type.
   *
   * @static
   * @param {Entity} type - Entity sub-class
   * @param {string} path - Path for new resource
   * @param {Function} MixinNestedResources - Mixin that extends Resource class
   *                                          with nested resources.
   * @param {string} [typeName] - Name of the entity posessing this resource.
   * @return {Function} - Resource factory function
   */
  static factoryFor (type, path = '', MixinNestedResources, typeName) {
    if (!type) {
      throw new Error('Entity type is necessary for resource factory.')
    }

    // No "this" binding with arrow function! This needs to run in the context
    // where it is mixed in / attached.
    return function (id) {
      // Allowed on Scopes, Resources and Entities.
      let parentPath, parentScope, newPath

      if (this instanceof Scope) {
        parentScope = this
        parentPath = ''
      } else if (this instanceof Resource) {
        parentScope = this.scope
        parentPath = this.path
      } else if (this instanceof Entity) {
        parentScope = this[symbols.resource].scope
        parentPath = this[symbols.resource].path
      }

      newPath = parentPath + path

      if (id) {
        if (!isString(id)) {
          throw new TypeError('ID must be a string.')
        }
        newPath += `/${encodeURIComponent(id)}`
      }

      const XResource = MixinNestedResources
        ? MixinNestedResources(Resource)
        : Resource
      return new XResource(parentScope, newPath, type, id, typeName)
    }
  }

  /**
   * A Resource requires a Scope sub-class (App, Operator, etc.) and the
   * corresponding path in the Engine API. An Entity sub-class can be
   * provided, in which case is it used to create instance of that Entity class
   * when returning from API requests.
   *
   * @param {Scope} scope - Scope containing API Key
   * @param {string} path - Relative path to API resource
   * @param {Entity} [type] - Reference to Entity class (constructor)
   * @param {string} [id] - The resource ID, if specified.
   * @param {string} [typeName] - Name of the entity posessing this resource.
   */
  constructor (scope, path, type, id, typeName) {
    // if (settings.apiVersion == 2) {
    //   ensureSupportedScopeForApiVersionV2();
    // }
    if (!(scope && scope instanceof Scope)) {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.Application).')
    }

    if (!isString(path)) {
      throw new TypeError('Resource must have a String path.')
    }

    // Setup scope for each of the subsequent calls.
    this.scope = scope

    // Setup path and allow to omit leading '/'.
    this.path = `${path[0] !== '/' ? '/' : ''}${path}`

    // Allow chainable parameter helpers
    this.preParams = {}

    // Remember the resource ID if specified
    this.id = id

    // Some sub-resources need to know what they belong to
    this.typeName = typeName

    // Setup entity for serializing and deserializing results. It must
    // implement *toJSON()* method, as defined in the Entity base class.
    if (type && (type === Entity || type.prototype instanceof Entity)) {
      this.type = type
    }
  }

  /**
   * Convert an Entity instance into plain JSON payload for API requests.
   *
   * @param {Entity} entity - Instace of entity object
   * @returns {Object}
   */
  serialize (entity = {}) {
    if (!(this.type && entity instanceof this.type)) {
      return entity
    }
    return entity.json()
  }

  /**
   * Opposite of serialization. Convert API responses into proper Entities
   * using the entity class of the resource. If response is a collection,
   * converts each of the items.
   *
   * @param {Object} response - JSON response from API
   * @returns {Object|Entity|Response} - Entity if able to deserialize;
   * Response if fullResponse option was used; Object otherwise.
   */
  deserialize (response) {
    if (response && this.type) {
      if (Array.isArray(response)) {
        if (typeof response[0] === 'object') {
          // Deserialise each item, if they're objects
          return response.map(this.deserialize.bind(this))
        } else {
          // Basic string type
          return response
        }
      }

      if (response.body) {
        // Full response, add deserialize method to deserialize the Response's
        // json body
        response.deserialize = () => response.json()
          .then(this.deserialize.bind(this))
      } else {
        // JSON response, base case.
        // Create new entity with updated resource derived from current.
        let newPath = this.path

        // Expand resource path with ID of entity.
        if (response.id && newPath.indexOf(response.id) === -1) {
          newPath += `/${response.id}`
        }

        const newResource = new Resource(this.scope, newPath, this.type)
        const EntityType = this.type
        return new EntityType(newResource, response)
      }
    }

    return response
  }

  /**
   * Helper for the 'withScopes=true' param.
   *
   * E.g: user.thng().setWithScopes().read()
   *
   * @returns {Resource} this
   */
  setWithScopes () {
    this.preParams.withScopes = true
    return this
  }

  /**
   * Helper for the 'context=true' param.
   *
   * E.g: user.action('scans').setContext().read()
   *
   * @returns {Resource} this
   */
  setContext () {
    this.preParams.context = true
    return this
  }

  /**
   * Helper for the 'perPage' param.
   *
   * E.g: user.product().setPerPage(100).read()
   *
   * @param {number} value - The value to set to the 'perPage' parameter.
   * @returns {Resource} this
   */
  setPerPage (value) {
    this.preParams.perPage = value
    return this
  }

  /**
   * Helper for the 'project' param.
   *
   * E.g: user.product().setProject('U6N4KcNNCSdyVHRaRmryhtPm').read()
   *
   * @param {string} id - The value to set to the 'project' parameter.
   * @returns {Resource} this
   */
  setProject (id) {
    this.preParams.project = id
    return this
  }

  /**
   * Helper for the 'filter' param.
   *
   * E.g: user.product().setFilter('tags=load2').read()
   *
   * @param {number} value - The value to set to the 'filter' parameter.
   * @returns {Resource} this
   */
  setFilter (value) {
    this.preParams.filter = value
    return this
  }

  /**
   * Helper for the 'ids' param.
   *
   * E.g: user.thng().setIds(['UNREK4bCUSCdGpRwaKMfdPfs', 'U7xPy2xqkbHyskaaR3MQUgrh']).read()
   *
   * @param {string[]} ids - Array of IDs.
   * @returns {Resource} this
   */
  setIds (ids) {
    this.preParams.ids = ids
    return this
  }

  /**
   * Create a new entity for this resource.
   *
   * @param {Object|Entity} data - Entity to create
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  create (data, options, callback) {
    if (!data || isFunction(data)) {
      throw new TypeError('Create method must have payload.')
    }
    const req = {
      url: this.path,
      data,
      method: 'post'
    }

    return this._request(req, options, callback)
  }

  /**
   * Reads resource entities.
   *
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  read (options, callback) {
    return this._request({
      url: this.path,
      method: 'get'
    }, options, callback)
  }

  /**
   * Updates entity via this resource.
   *
   * @param {Object|Entity} data - Entity to create
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  update (data, options, callback) {
    if (!data || isFunction(data)) {
      throw new TypeError('Update method must have payload.')
    }

    return this._request({
      url: this.path,
      data,
      method: 'put'
    }, options, callback)
  }

  /**
   * Deletes entity in resource.
   *
   * @param {Settings} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  ['delete'] (options, callback) {
    return this._request({
      url: this.path,
      method: 'delete'
    }, options, callback)
  }

  /**
   * Returns a page iterator. It is essentially an async generator that returns
   * a promise to the next page on every `.next()` invocation.
   *
   * @param {Settings} [options] - Options of the request
   * @returns {AsyncGenerator}
   * @example
   *
   * ```
   *   const it = operator.thng().pages()
   *   it.next().then(console.log)
   *
   *   // or in ES7+
   *
   *   for await (let page of pages) {
   *     console.log(page)
   *   }
   * ```
   */
  async * pages (options = {}) {
    const fullResponse = options.fullResponse
    let response

    // Read first 'page' with user-defined options.
    response = await this._linkRequest({ url: this.path }, fullResponse, options)
    yield response.result

    while (response.next) {
      response = await this._linkRequest({ apiUrl: response.next }, fullResponse)
      yield response.result
    }
  }

  /**
   * Set a new list of project scopes, and optionally a new list of user scopes.
   * Existing project scopes are replaced, not augmented. Empty array is accepted to fully descope.
   * If 'users' is not specified, existing user scopes are preserved.
   *
   * @param {string[]} projects - Array of project IDs to set as the resource's 'projects' scope.
   * @param {string[]} [users] - Optional array of Application User IDs to set as the 'users' scope.
   * @returns {Promise} Promise that resolves once the scope update has been completed.
   */
  async rescope (projects, users) {
    if (!projects) {
      throw new Error('An array of project IDs to be scoped to must be provided')
    }

    const params = { withScopes: true }
    const { scopes } = await this.read({ params })

    scopes.projects = projects
    if (Array.isArray(users)) {
      scopes.users = users
    }

    return this.update({ scopes })
  }

  /**
   * Update a resource by 'name' or an identifier key-value pair, and create it if it does not exist.
   *
   * If more than one match is found and the 'allowPlural' parameter is not set to 'true',
   * an error will be thrown. If it is set, the *first* item returned will be updated.
   *
   * @param {object} data - Create/update payload to use.
   * @param {object|string} updateKey - Name string or key-value identifier pair to search with.
   * @param {boolean} [allowPlural] - Flag to not throw an error if more than one result is found.
   * @returns {Promise} Promise that resolves once complete.
   */
  async upsert (data, updateKey, allowPlural) {
    if (!updateKey || !(typeof updateKey === 'string' || typeof updateKey === 'object')) {
      throw new Error('updateKey must be a \'name\' string or an object, eg: { shortId: \'a7ysf8hd\' }')
    }

    const params = { filter: `name=${updateKey}` }
    if (typeof updateKey === 'object') {
      const [key, value] = Object.entries(updateKey)[0]
      params.filter = `identifiers.${key}=${value}`
    }

    const found = await this.read({ params })
    if (found.length > 1) {
      if (!allowPlural) {
        throw new Error('More than one resource was found. Set \'allowPlural\' to \'true\' as third parameter to update the first returned.')
      }
    }
    if (found.length) {
      return found[0].update(data)
    }

    return this.create(data)
  }

  /**
   * Find some of the resources by 'name' or a single identifier key-value pair.
   * A convenience method for using the 'filter' parameter.
   *
   * @param {object|string} updateKey - String 'name' or object containing single key-value pair.
   * @returns {Promise} Promise that resolves when the request returns.
   */
  async find (updateKey) {
    const params = { filter: `name=${updateKey}` }
    if (typeof updateKey === 'object') {
      const pairs = Object.entries(updateKey);
      if (pairs.length > 1) {
        throw new Error('Only one key-value pair may be specified for find()')
      }

      const [key, value] = pairs[0]
      params.filter = `identifiers.${key}=${value}`
    }

    return this.read({ params })
  }

  /**
   * Stream a set of resources, calling an async function for each item.
   *
   * The callback is passed the item and cumulative item index. If iteration should
   * stop, the callback should return `true`.
   *
   * @param {function} eachItemCb - Async function to call for each item.
   */
  async stream (eachItemCb) {
    const iterator = this.pages()
    let totalSoFar = 0
    let page
    let willStop

    while (!(page = await iterator.next()).done) {
      for (let i = 0; i < page.value.length; i += 1) {
        if (typeof willStop === 'boolean' && willStop) {
          return
        }

        willStop = await eachItemCb(page.value[i], totalSoFar + i)
      }

      totalSoFar += page.value.length
    }
  }

  /**
   * Stream a set of resources, calling an async function for each item.
   * Similar to stream(), but the callback presents each page.
   *
   * The callback is passed the page and cumulative item total (before the current page).
   * If iteration should stop, the callback should return `true`.
   *
   * @param {function} eachPageCb - Async function to call for each page of items.
   */
  async streamPages (eachPageCb) {
    const iterator = this.pages()
    let totalSoFar = 0
    let page
    let willStop

    while (!(page = await iterator.next()).done) {
      willStop = await eachPageCb(page.value, totalSoFar)

      totalSoFar += page.value.length
      if (typeof willStop === 'boolean' && willStop) {
        return
      }
    }
  }

  // PRIVATE

  /**
   * Actual request call. This method merges mandatory request options with
   * user provided ones and forces the resource path and API Key, so they are
   * not overriden. Serializes any body passed in, and deserializes response in
   * the end.
   *
   * Callback may be used in place of userOptions.
   *
   * @param {Settings} requestOptions - Mandatory request options
   * @param {Settings} [userOptions] - Optional user options
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise.<Object|Entity|Response>}
   * @private
   */
  async _request (requestOptions, userOptions = {}, callback) {
    if (isFunction(userOptions)) {
      callback = userOptions
    }

    // Merge options, priority to mandatory ones.
    const options = Object.assign(
      {},
      userOptions,
      requestOptions,
      {
        apiKey: this.scope.apiKey
      }
    )

    // Serialize Entity into JSON payload.
    if (options.body) {
      options.body = await this.serialize(options.body)
    }

    // Any preParams set?
    if (Object.keys(this.preParams).length) {
      Object.assign(options, { params: this.preParams })
      this.preParams = {}
    }

    // Execute callback after deserialization.
    try {
      const response = await api(options)
      const deserialized = await this.deserialize(response)
      return success(callback)(deserialized)
    } catch (err) {
      throw failure(callback)(err)
    }
  }

  /**
   * Async request that parses the link header if any.
   *
   * @param {Settings} requestOptions - Mandatory request options
   * @param {Boolean} fullResponse - Wrap Response or not
   * @param {Settings} [userOptions] - Optional user options
   * @returns {Promise.<{result: Response|Array, next: string}>}
   * @private
   */
  async _linkRequest (requestOptions, fullResponse, userOptions = {}) {
    const opts = Object.assign({ fullResponse: true }, requestOptions)
    const response = await this._request(opts, userOptions)
    const linkHeader = parseLinkHeader(response.headers.get('link'))
    const next = linkHeader.next && decodeURIComponent(linkHeader.next)
    const result = await (fullResponse ? response : response.json())
    return { result, next }
  }
}
