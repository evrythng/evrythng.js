import Entity from './Entity'
import Property from './Property'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/products'
const ProductResources = mixinResources([
  Property
  // Action
])

/**
 * Represents a Product entity.
 *
 * @export
 * @class Product
 */
export default class Product extends ProductResources(Entity) {
  static resourceFactory () {
    return {
      product: Resource.factoryFor(Product, path, ProductResources)
    }
  }
}
