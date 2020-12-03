/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Task from '../../../src/entity/Task'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'

let taskResource
let resource

describe('Task', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      resource = Object.assign(dummyResource(), Task.resourceFactory())
    })

    it('should not be allowed as top level resource (on Scopes)', () => {
      const scope = Object.assign(dummyScope(), Task.resourceFactory())
      const topLevelResource = () => scope.task()
      expect(topLevelResource).toThrow()
    })

    it('should create new Task resource', () => {
      taskResource = resource.task()
      expect(taskResource instanceof Resource).toBe(true)
      expect(taskResource.type).toBe(Task)
    })

    it('should add permissions path', () => {
      taskResource = resource.task()
      expect(taskResource.path).toEqual(`${paths.dummy}${paths.tasks}`)
    })
  })
})
