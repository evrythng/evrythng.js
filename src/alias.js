import Operator from './scope/Operator'
import Application from './scope/Application'
import TrustedApplication from './scope/TrustedApplication'
import User from './scope/User'

const SCOPES = {
  Operator,
  Application,
  TrustedApplication,
  User,
}

/**
 * Define a new resource type as a simple alias of an existing resource type,
 * and can be used to create use-case or client-specific libraries.
 *
 * The new resource is made available on the same scopes that had access before.
 * The existing resource is not removed or hidden from scopes. The alias in in
 * name only.
 *
 * For example, if a Product is to be used as a SKU by Application Users:
 *   evrythng.alias({ product: 'sku' }, 'User')
 * This enables the use of a 'sku' resource in the exact same way as a product:
 *   user.sku().read()
 *
 * @param {object} map - Object mapping the old type to a new type.
 * @param {string} target - Name of the scope to apply the new resource to.
 */
export default function alias (map, target) {
  const scopes = Object.keys(SCOPES)
  if (!scopes.includes(target)) {
    throw new Error(`Invalid target. Choose from ${scopes.join(', ')}`)
  }

  const original = SCOPES[target]
  for (const existing in map) {
    if (!original.prototype[existing]) {
      throw new Error(`${existing} does not exist for ${target}`)
    }

    Object.assign(
      original.prototype,
      {
        [map[existing]]: original.prototype[existing]
      }
    )
  }
}
