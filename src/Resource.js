import Scope from './scopes/Scope'
import isString from 'lodash-es/isString'
import isFunction from 'lodash-es/isFunction'

export default class Resource {
  constructor (scope, path, entity) {
    // Setup scope for each of the subsequent calls.
    if (scope && scope instanceof Scope) {
      this.scope = scope
    } else {
      throw new TypeError('Scope should inherit from Scope (e.g. EVT.App).')
    }

    // Setup path and allow to omit leading '/'.
    if (isString(path)) {
      this.path = (path[0] !== '/' ? '/' : '') + path
    } else {
      throw new TypeError('Resource must have a String path.')
    }

    // Setup class for serializing and deserializing results. It must implement
    // a *toJSON()* method. This method is in the Entity prototype. Since all of our
    // entities inherit from Entity, by default all of them will have this.
    if (isFunction(entity)) {
      if (isFunction(entity.toJSON)) {
        this.entity = entity
      } else {
        // Logger.error('Class for resource "' + path + '" does not implement toJSON().')
      }
    } else {
      // Logger.info('Class for resource "' + path + '" undefined. It will not return ' +
      // 'proper Entities nor cascaded Entities.')
    }
  }
}
