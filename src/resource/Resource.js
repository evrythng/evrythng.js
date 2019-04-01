import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'
import Scope from '../scope/Scope'
import Entity from '../entity/Entity'
import api from '../api'
import { success, failure } from '../util/callback'
import symbols from '../symbols'
import parseLinkHeader from '../util/parseLinkHeader'

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
   * with nested resources
   * @return {Function} - Resource factory function
   */
  static factoryFor (type, path = '', MixinNestedResources) {
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
      return new XResource(parentScope, newPath, type)
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
   */
  constructor (scope, path, type) {
    if (!(scope && scope instanceof Scope)) {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.App).')
    }

    if (!isString(path)) {
      throw new TypeError('Resource must have a String path.')
    }

    // Setup scope for each of the subsequent calls.
    this.scope = scope

    // Setup path and allow to omit leading '/'.
    this.path = `${path[0] !== '/' ? '/' : ''}${path}`

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
        return response.map(this.deserialize.bind(this))
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
  async *pages (options = {}) {
    const fullResponse = options.fullResponse
    let response

    // Read first 'page' with user-defined options.
    response = await this._linkRequest({url: this.path}, fullResponse, options)
    yield response.result

    while (response.next) {
      response = await this._linkRequest({apiUrl: response.next}, fullResponse)
      yield response.result
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
