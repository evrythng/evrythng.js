/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import ReactorSchedule from '../../../src/entity/ReactorSchedule'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope } from '../../helpers/dummy'
import { reactorScheduleTemplate } from '../../helpers/data'

let reactorScheduleResource

describe('ReactorSchedule', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), ReactorSchedule.resourceFactory())
      reactorScheduleResource = scope.reactorSchedule(reactorScheduleTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(reactorScheduleResource instanceof Resource).toBe(true)
      expect(reactorScheduleResource.type).toBe(ReactorSchedule)
      expect(reactorScheduleResource.path)
        .toEqual(`${paths.reactorSchedules}/${reactorScheduleTemplate.id}`)
    })
  })
})
