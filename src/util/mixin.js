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
 *
 * @param {Array} entities - List of entities to add resources to
 * @return {function(Scope)}
 */
export function mixinResources (entities) {
  const resourceFactories = entities.map(e => e.resourceFactory())
  const accessResources = Object.assign({}, ...resourceFactories)
  return Superclass => mixin(accessResources)(class extends Superclass {})
}

/**
 * Simplified mixin definition. Enough for our use case.
 * See: http://raganwald.com/2015/06/17/functional-mixins.html
 *
 * @param {Object} behaviour - Shared behaviour object literal
 * @param {Boolean} proto - Indicates if mixin should be applied to prototype
 * @return {function(target)}
 */
export default function mixin (behaviour, proto = true) {
  return (target) => {
    for (let property of Reflect.ownKeys(behaviour)) {
      Object.defineProperty(
        proto ? target.prototype : target,
        property,
        { value: behaviour[property] }
      )
    }
    return target
  }
}
