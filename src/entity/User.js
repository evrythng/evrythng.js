import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/users'

/**
 * Represents a User entity object.
 *
 * @extends Entity
 */
export default class User extends Entity {
  /**
   * Return simple resource factory for AppUsers.
   *
   * @static
   * @return {{user: Function}}
   */
  static resourceFactory () {
    return {
      user: Resource.factoryFor(User, path)
    }
  }
}
