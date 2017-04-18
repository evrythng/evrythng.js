/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Collection from '../../../src/entity/Collection'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import { collectionTemplate } from '../../helpers/data'

let collectionResource
let collection
const collectionPath = `${paths.collections}/${collectionTemplate.id}`

describe('Collection', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Collection.resourceFactory())
      collectionResource = scope.collection(collectionTemplate.id)
    })

    it('should create new Collection resource', () => {
      expect(collectionResource instanceof Resource).toBe(true)
      expect(collectionResource.type).toBe(Collection)
      expect(collectionResource.path).toEqual(collectionPath)
    })

    it('should have nested thng resource', () => {
      expect(collectionResource.thng).toBeDefined()
      expect(collectionResource.thng().path).toEqual(`${collectionPath}${paths.thngs}`)
    })

    it('should have nested collection resource', () => {
      expect(collectionResource.collection).toBeDefined()
      expect(collectionResource.collection().path).toEqual(`${collectionPath}${paths.collections}`)
    })

    it('should have nested action resource', () => {
      expect(collectionResource.action).toBeDefined()
      expect(collectionResource.action('all').path).toEqual(`${collectionPath}${paths.actions}/all`)
    })
  })

  describe('access', () => {
    beforeEach(() => {
      collection = new Collection(dummyResource())
    })

    it('should have thng resource', () => {
      expect(collection.thng).toBeDefined()
    })

    it('should have collection resource', () => {
      expect(collection.collection).toBeDefined()
    })

    it('should have action resource', () => {
      expect(collection.action).toBeDefined()
    })
  })
})
