import Entity from './Entity'
import Resource from '../resource/Resource'
import Scope from '../scope/Scope'
import isString from 'lodash-es/isString'

const path = '/redirector'

/**
 * Represents a Redirection entity.
 *
 * @extends Entity
 */
export default class Redirection extends Entity {
  /**
   * Return simple resource factory for Redirections.
   *
   * @static
   * @return {{redirection: Function}}
   */
  static resourceFactory () {
    return {
      redirection () {
        // Redirections don't have single resource endpoint (e.g.: /redirector/:id)
        if (isString(arguments[0])) {
          throw new TypeError('There is no single resource for Redirections')
        }

        // Only allowed on Entities and Resources.
        if (this instanceof Scope) {
          throw new Error('Redirection is not a top-level resource.')
        }

        return Resource.factoryFor(Redirection, path).call(this)
      }
    }
  }
}
