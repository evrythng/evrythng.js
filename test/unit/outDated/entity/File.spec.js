/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import File from '../../../src/entity/File'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { fileTemplate } from '../../helpers/data'

let fileResource

describe('File', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), File.resourceFactory())
      fileResource = scope.file(fileTemplate.id)
    })

    it('should create new Role resource', () => {
      expect(fileResource instanceof Resource).toBe(true)
      expect(fileResource.type).toBe(File)
      expect(fileResource.path).toEqual(`${paths.files}/${fileTemplate.id}`)
    })
  })
})
