import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import isString from 'lodash-es/isString'

const path = '/domains'

/**
 * Represents a Domain entity.
 *
 * @extends Entity
 */
export default class Domain extends Entity {
  /**
   * Return simple resource factory for Domains.
   *
   * @static
   * @return {{domain: Function}}
   */
  static resourceFactory () {
    return {
      domain () {
        // Domains don't have single resource endpoint (e.g.: /domains/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Domains')
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Domain is not a top-level resource.')
        }

        return Resource.factoryFor(Domain, path).call(this)
      }
    }
  }
}
