import Entity from './Entity'
import Resource from '../resource/Resource'

const path = '/accessPolicies'

/**
 * Represents an Access Policy entity.
 *
 * @extends Entity
 */
export default class AccessPolicy extends Entity {
  /**
   * Return simple resource factory for Access Policies.
   *
   * @static
   * @return {{accessPolicy: Function}}
   */
  static resourceFactory () {
    return {
      accessPolicy (id) {
        return Resource.factoryFor(AccessPolicy, path).call(this, id)
      }
    }
  }
}
