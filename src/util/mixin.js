/**
 * Simplified mixin definition. Enough for our use case.
 * See: http://raganwald.com/2015/06/17/functional-mixins.html
 *
 * @param {Object} behaviour - Shared behaviour object literal
 * @return {function(class)}
 */
export default function mixin (behaviour) {
  return (target) => {
    for (let property of Reflect.ownKeys(behaviour)) {
      Object.defineProperty(target.prototype, property, { value: behaviour[property] })
    }
    return target
  }
}
