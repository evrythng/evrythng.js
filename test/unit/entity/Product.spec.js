/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Product from '../../../src/entity/Product'
import { dummyScope, dummyResource } from '../../helpers/dummy'

const productId = 'productId'
const productsPath = '/products'
let productResource
let product

describe('Product', () => {
  describe('resourceFactory', () => {
    beforeEach(() => {
      const mixin = Object.assign(dummyScope(), Product.resourceFactory())
      productResource = mixin.product(productId)
    })

    it('should create new Product resource', () => {
      expect(productResource instanceof Resource).toBe(true)
      expect(productResource.type).toBe(Product)
      expect(productResource.path).toEqual(`${productsPath}/${productId}`)
    })

    it('should have nested property resource', () => {
      expect(productResource.property).toBeDefined()
    })

    it('should have nested action resource', () => {
      expect(productResource.action).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      product = new Product(dummyResource())
    })

    it('should have property resource', () => {
      expect(product.property).toBeDefined()
    })

    it('should have action resource', () => {
      expect(product.action).toBeDefined()
    })
  })
})
