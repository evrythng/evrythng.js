import Entity from './Entity'
import Property from './Property'
import Action from './Action'
import Redirection from './Redirection'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/products'
const ProductResources = mixinResources([Property, Action, Redirection])

/**
 * Represents a Product entity object.
 *
 * @extends Entity
 */
export default class Product extends ProductResources(Entity) {
  /**
   * Return simple resource factory for Products.
   *
   * @static
   * @return {{product: Function}}
   */
  static resourceFactory () {
    return {
      product: Resource.factoryFor(Product, path, ProductResources, 'product')
    }
  }
}
