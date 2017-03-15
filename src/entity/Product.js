import Entity from './Entity'
import Property from './Property'
import Action from './Action'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/products'
const ProductResources = mixinResources([
  Property,
  Action
])

/**
 * Represents a Product entity object.
 *
 * @export
 * @class Product
 */
export default class Product extends ProductResources(Entity) {
  /**
   * Return simple resource factory for Products.
   *
   * @return {{product: Function}}
   */
  static resourceFactory () {
    return {
      product: Resource.factoryFor(Product, path, ProductResources)
    }
  }
}
