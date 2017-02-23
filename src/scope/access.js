import { mixinResources } from '../util/mixin'
import Product from '../entity/Product'
import Thng from '../entity/Thng'

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
export const OperatorAccess = mixinResources(operatorResources)
