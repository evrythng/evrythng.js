/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Place from '../../../src/entity/Place'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { placeTemplate } from '../../helpers/data'

let placeResource

describe('Place', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Place.resourceFactory())
      placeResource = scope.place(placeTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(placeResource instanceof Resource).toBe(true)
      expect(placeResource.type).toBe(Place)
      expect(placeResource.path).toEqual(`${paths.places}/${placeTemplate.id}`)
    })
  })
})
