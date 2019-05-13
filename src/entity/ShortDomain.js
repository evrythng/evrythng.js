import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import isString from 'lodash-es/isString'

const path = '/shortDomains'

/**
 * Represents a ShortDomain entity.
 *
 * @extends Entity
 */
export default class ShortDomain extends Entity {
  /**
   * Return simple resource factory for ShortDomains.
   *
   * @static
   * @return {{shortDomain: Function}}
   */
  static resourceFactory () {
    return {
      shortDomain () {
        // ShortDomains don't have single resource endpoint (e.g.: /shortDomains/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for ShortDomains')
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('ShortDomain is not a top-level resource.')
        }

        return Resource.factoryFor(ShortDomain, path).call(this)
      }
    }
  }
}
