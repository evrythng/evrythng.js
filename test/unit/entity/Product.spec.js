/* eslint-env jasmine */
import Scope from '../../../src/scope/Scope'
import Resource from '../../../src/resource/Resource'
import Product from '../../../src/entity/Product'

const apiKey = 'apiKey'
const productId = 'productId'
const productsPath = '/products'
const scope = new Scope(apiKey)
const resource = new Resource(scope, productsPath, Product)
let productResource
let product

describe('Product', () => {
  describe('resourceFactory', () => {
    beforeEach(() => {
      const mixin = Object.assign(new Scope(apiKey), Product.resourceFactory())
      productResource = mixin.product(productId)
    })

    it('should create new Product resource', () => {
      expect(productResource instanceof Resource).toBe(true)
      expect(productResource.entity).toBe(Product)
      expect(productResource.path).toEqual(`${productsPath}/${productId}`)
    })

    it('should have nested property resource', () => {
      expect(productResource.property).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      product = new Product(resource)
    })

    it('should have property resource', () => {
      expect(product.property).toBeDefined()
    })
  })
})
