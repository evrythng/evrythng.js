import Access from './Access'
import Domain from './Domain'
import OperatorAccess from './OperatorAccess'
import Entity from './Entity'
import ShortDomain from './ShortDomain'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/accounts'
const AccountResources = mixinResources([
  Domain, // R
  ShortDomain, // R
  Access, // RU
  OperatorAccess // CRUD
])

/**
 * Represents an Account entity object.
 *
 * @extends Entity
 */
export default class Account extends AccountResources(Entity) {
  /**
   * Return simple resource factory for Accounts.
   *
   * @static
   * @return {{sharedAccount: Function}}
   */
  static resourceFactory () {
    return {
      sharedAccount: Resource.factoryFor(Account, path, AccountResources)
    }
  }
}
