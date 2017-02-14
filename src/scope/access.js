import { mixin } from '../util'
import Product from '../entity/Product'
import Thng from '../entity/Thng'

/**
 * Return a subclass factory function that mixins the resource factory
 * functions from all the entities provided.
 * This provides a way to extend a Scope class and add a mixin that contains
 * all the resource methods available for that scope.
 *
 * E.g.
 * ```
 *  class Operator extends OperatorAccess(Scope) {}
 * ```
 *
 * See: http://raganwald.com/2015/12/28/mixins-subclass-factories-and-method-advice.html#fn:simplified
 * and OperatorAccess below.
 *
 * @param {Array} entities - List of entities to add resources to
 * @return {function(Scope)}
 */
function scopeResourceFactory (entities) {
  const resourceFactories = entities.map(e => e.resourceFactory())
  const accessResources = Object.assign(...resourceFactories)
  return Superclass => mixin(accessResources)(class extends Superclass {})
}

/**
 * An Operator currently has access to:
 *  - Product resource (CRUD)
 *  - Thng resource (CRUD)
 *  - App User resource (R)
 *  - Project resource (CRUD)
 *  - ActionType resource (CR)
 *  - Action resource (CRUD)
 *  - Collection resource (CRUD)
 *  - Batch resource (CRUD)
 */
const operatorResources = [
  Product,
  Thng
]

/**
 * Operator Access Mixin
 */
export const OperatorAccess = scopeResourceFactory(operatorResources)
