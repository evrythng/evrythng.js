/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import Project from '../../../src/entity/Project'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import { projectTemplate } from '../../helpers/data'

let projectResource
let project

describe('Project', () => {
  mockApi()

  describe('resourceFactory', () => {
    beforeEach(() => {
      const scope = Object.assign(dummyScope(), Project.resourceFactory())
      projectResource = scope.project(projectTemplate.id)
    })

    it('should create new Product resource', () => {
      expect(projectResource instanceof Resource).toBe(true)
      expect(projectResource.type).toBe(Project)
      expect(projectResource.path).toEqual(`${paths.projects}/${projectTemplate.id}`)
    })

    it('should have nested application resource', () => {
      expect(projectResource.application).toBeDefined()
    })
  })

  describe('access', () => {
    beforeEach(() => {
      project = new Project(dummyResource())
    })

    it('should have application resource', () => {
      expect(project.application).toBeDefined()
    })
  })
})
