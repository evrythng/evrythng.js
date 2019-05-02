import Entity from './Entity'
import Permission from './Permission'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/roles'
const RoleResources = mixinResources([
  Permission
])

/**
 * Represents a Role entity object.
 *
 * @extends Entity
 */
export default class Role extends RoleResources(Entity) {
  /**
   * Return simple resource factory for Roles.
   *
   * @static
   * @return {{roles: Function}}
   */
  static resourceFactory () {
    return {
      roles: Resource.factoryFor(Role, path, RoleResources)
    }
  }
}
