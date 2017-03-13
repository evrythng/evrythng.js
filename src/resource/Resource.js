import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'
import Scope from '../scope/Scope'
import Entity from '../entity/Entity'
import api, { success, failure } from '../api'

/**
 * A Resource is the base class that implements the CRUD methods behavior.
 * All resource requests are scoped (i.e. they use the scope's API Key).
 *
 * Every resource operation tries to serialize/deserialize the type of object
 * corresponding to the resource (i.e. when creating a Thng, the developer gets
 * a Thng entity back, with nested methods).
 *
 * @export
 * @class Resource
 */
export default class Resource {
  /**
   * A Resource requires a Scope sub-class (App, Operator, etc.) and the
   * corresponding path in the Engine API. An Entity sub-class can be
   * provider, in which case is it used to create instance of that Entity class
   * when returning from API requests.
   *
   * @param {Scope} scope - Scope containing API Key
   * @param {string} path - Relative path to API resource
   * @param {Entity} [entity] - Reference to Entity class (constructor)
   */
  constructor (scope, path, entity) {
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
    if (entity && (entity === Entity || entity.prototype instanceof Entity)) {
      this.entity = entity
    }
  }

  /**
   * Convert an Entity instance into plain JSON payload for API requests.
   *
   * @param {Entity} entity - Instace of entity object
   * @returns {Object}
   */
  serialize (entity = {}) {
    if (!(this.entity && entity instanceof this.entity)) {
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
    if (response && this.entity) {
      if (isArray(response)) {
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

        const newResource = new Resource(this.scope, newPath, this.entity)
        const EntityClass = this.entity
        return new EntityClass(newResource, response)
      }
    }

    return response
  }

  /**
   * Create a new entity for this resource.
   *
   * @param {Object|Entity} body - Entity to create
   * @param {Object} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  create (body, options, callback) {
    if (!body || isFunction(body)) {
      throw new TypeError('Create method must have payload.')
    }

    return this._request({ body, method: 'post' }, options, callback)
  }

  /**
   * Reads resource entities.
   *
   * @param {Object} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  read (options, callback) {
    return this._request({ method: 'get' }, options, callback)
  }

  /**
   * Updates entity via this resource.
   *
   * @param {Object|Entity} body - Entity to create
   * @param {Object} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  update (body, options, callback) {
    if (!body || isFunction(body)) {
      throw new TypeError('Update method must have payload.')
    }

    return this._request({ body, method: 'put' }, options, callback)
  }

  /**
   * Deletes entity in resource.
   *
   * @param {Object} [options] - Options of the request
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise}
   */
  ['delete'] (options, callback) {
    return this._request({ method: 'delete' }, options, callback)
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
   * @param {Objects} requestOptions - Mandatory request options
   * @param {Object} [userOptions] - Optional user options
   * @param {Function} [callback] - Error-first callback
   * @returns {Promise.<Object|Entity|Response>}
   * @private
   */
  _request (requestOptions, userOptions = {}, callback) {
    if (isFunction(userOptions)) {
      callback = userOptions
    }

    // Merge options, priority to mandatory ones.
    const options = Object.assign(
      userOptions,
      requestOptions,
      {
        url: this.path,
        apiKey: this.scope.apiKey
      }
    )

    // Serialize Entity into JSON payload.
    if (options.body) {
      options.body = this.serialize(options.body)
    }

    // Execute callback after deserialization.
    return api(options)
      .then(this.deserialize.bind(this))
      .then(success(callback))
      .catch(failure(callback))
  }

  /**
   * Returns a resource factory function for the given entity type.
   *
   * @param {Entity} entity - Entity sub-class
   * @param {string} path - Path for new resource
   * @param {Function} MixinNestedResources - Mixin that extends Resource class
   * with nested resources
   * @return {Function} - Resource factory function
   */
  static factoryFor (entity, path = '', MixinNestedResources) {
    if (!entity) {
      throw new Error('Entity is necessary for resource factory.')
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
      } else {
        parentScope = this.resource.scope
        parentPath = this.resource.path
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
      return new XResource(parentScope, newPath, entity)
    }
  }
}
