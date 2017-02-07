import isString from 'lodash-es/isString'
import Scope from '../scope/Scope'
import Entity from '../entity/Entity'

/**
 * A Resource is the base class that implements the CRUD methods behavior.
 * All resource requests are scoped (i.e. they use the scope's API Key.
 *
 * Every resource operation tries to serialize/deserialize the type of object
 * corresponding to the resource (i.e. when creating a Thng, the developer gets
 * a Thng entity back, with nested methods.
 *
 * @export
 * @class Resource
 */
export default class Resource {
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
    if (entity instanceof Entity) {
      this.entity = entity
    }
  }

  update () {

  }

  ['delete'] () {

  }
}
