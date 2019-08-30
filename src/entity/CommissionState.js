import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import symbols from '../symbols'
import isString from 'lodash-es/isString'

const path = '/commissionState'

/**
 * Represents a Thng's commissioning state.
 *
 * @extends Entity
 */
export default class CommissionState extends Entity {
  /**
   * Return resource factory for CommissionState.
   *
   * Only read() is permitted by the API.
   *
   * @static
   * @return {{commissionState: Function}}
   */
  static resourceFactory () {
    return {
      commissionState () {
        // commissionState don't have single resource endpoint (e.g.: /locations/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for CommissionState')
        }

        // Concatenate on the end of the Thng resource location
        const thngPath = this instanceof Scope ? this[symbols.path] : ''

        return Resource.factoryFor(CommissionState, thngPath + path).call(this)
      }
    }
  }
}
