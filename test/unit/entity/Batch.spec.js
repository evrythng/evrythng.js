/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Batch from '../../../src/entity/Batch'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import { batchTemplate } from '../../helpers/data'

let batchResource
let batch

describe('Batch', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Batch.resourceFactory())
      batchResource = scope.batch(batchTemplate.id)
    })

    it('should create new Batch resource', () => {
      expect(batchResource instanceof Resource).toBe(true)
      expect(batchResource.type).toBe(Batch)
      expect(batchResource.path).toEqual(`${paths.batches}/${batchTemplate.id}`)
    })

    it('should have nested task resource', () => {
      expect(batchResource.task).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      batch = new Batch(dummyResource())
    })

    it('should have task resource', () => {
      expect(batch.task).toBeDefined()
    })
  })
})
