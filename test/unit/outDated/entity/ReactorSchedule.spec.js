/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import ReactorSchedule from '../../../src/entity/ReactorSchedule'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyResource } from '../../helpers/dummy'
import { reactorScheduleTemplate } from '../../helpers/data'

let reactorScheduleResource

describe('ReactorSchedule', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const resource = Object.assign(dummyResource(), ReactorSchedule.resourceFactory())
      reactorScheduleResource = resource.reactorSchedule(reactorScheduleTemplate.id)
    })

    it('should create new ReactorSchedule resource', () => {
      expect(reactorScheduleResource instanceof Resource).toBe(true)
      expect(reactorScheduleResource.type).toBe(ReactorSchedule)
      expect(reactorScheduleResource.path).toEqual(
        `${paths.dummy}${paths.reactorSchedules}/${reactorScheduleTemplate.id}`
      )
    })
  })
})
