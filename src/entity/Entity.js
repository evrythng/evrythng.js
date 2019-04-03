import Resource from '../resource/Resource'
import symbols from '../symbols'

/**
 * Entity is the base class for all types of entities in the EVRYTHNG API.
 * An Entity knows how to update and delete itself given that a resource is
 * provided.
 */
export default class Entity {
  /**
   * Creates an new entity of given Resource. Optionally can be initialized
   * with pre-defined data.
   *
   * @param {Resource} resource - Resource owner of this entity.
   * @param {Object} [body] Optional entity data
   */
  constructor (resource, body = {}) {
    if (!(resource && resource instanceof Resource)) {
      throw new Error('Resource must be a Resource.')
    }

    // Define non-enumerable unique resource property so it's not copied over
    // in shallow copies of this (e.g. using Object.assign).
    this[symbols.resource] = resource

    // Extend Entity with data.
    Object.assign(this, body)
  }

  /**
   * Returns all enumerable properties.
   *
   * @returns {Object}
   */
  json () {
    return Object.entries(this)
      .reduce((ret, [k, v]) => Object.assign(ret, { [k]: v }), {})
  }

  /**
   * Update itself by calling the update method of the owning resource and
   * passing the JSON representation of itself or the given body object.
   *
   * @param {Object} body - optional body, use self as default
   * @param {Function} callback - error-first callback
   * @returns {Promise.<Object>}
   */
  update (body = this.json(), callback) {
    return this[symbols.resource].update(body, callback)
      .then(updated => {
        // Update self and keep chaining with API response.
        Object.assign(this, updated)
        return updated
      })
  }

  /**
   * Delete itself by calling the delete method of the owning resource.
   *
   * @param {Function} callback - error-first callback
   * @returns {Promise.<Object>}
   */
  ['delete'] (callback) {
    return this[symbols.resource].delete(callback)
  }
}
