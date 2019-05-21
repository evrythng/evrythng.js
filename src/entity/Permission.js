import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import isString from 'lodash-es/isString'

const path = '/permissions'

/**
 * Represents a Permission entity.
 *
 * @extends Entity
 */
export default class Permission extends Entity {
  /**
   * Return simple resource factory for Permissions.
   *
   * @static
   * @return {{permission: Function}}
   */
  static resourceFactory () {
    return {
      permission () {
        // Permissions don't have single resource endpoint (e.g.: /permissions/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Permissions')
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Permission is not a top-level resource.')
        }

        return Resource.factoryFor(Permission, path).call(this)
      }
    }
  }
}
