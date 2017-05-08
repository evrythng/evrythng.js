import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/users'

/**
 * Represents a Role entity object.
 *
 * @extends Entity
 */
export default class AppUser extends Entity {
  /**
   * Return simple resource factory for AppUsers.
   *
   * @static
   * @return {{appUser: Function}}
   */
  static resourceFactory () {
    return {
      appUser: Resource.factoryFor(AppUser, path)
    }
  }
}
