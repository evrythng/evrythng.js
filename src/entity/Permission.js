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
      permission (name) {
        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Permission is not a top-level resource.')
        }

        return Resource.factoryFor(Permission, path).call(this, name)
      }
    }
  }
}
