import Entity from './Entity'
import Resource from '../resource/Resource'
import { mixinResources } from '../util/mixin'

const path = '/products'
const ProductResources = mixinResources([
  // Property,
  // Action
])

export default class Product extends ProductResources(Entity) {
  static resourceFactory () {
    return {
      product: Resource.factoryFor(Product, path)
    }
  }
}
