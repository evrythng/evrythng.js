/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import AppUserAccess from '../../../src/entity/AppUserAccess'
import fetchMock from 'fetch-mock'
import apiUrl from '../../helpers/apiUrl'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import {
  apiKey,
  optionsTemplate,
  appUserTemplate,
  appUserAccessTemplate
} from '../../helpers/data'

const cb = () => {}
let appUserAccessResource
let appUserAccess
let scope

describe('AppUserAccess', () => {
  mockApi()

  it('should convert evrythngUser property to standard id', () => {
    appUserAccess = new AppUserAccess(dummyResource(), appUserAccessTemplate)
    expect(appUserAccess.id).toEqual(appUserAccessTemplate.evrythngUser)
    expect(appUserAccess.evrythngUser).not.toBeDefined()
  })

  describe('validate', () => {
    beforeEach(() => {
      appUserAccess = new AppUserAccess(dummyResource(), appUserAccessTemplate)
    })

    it('should throw if no activaction code provided', () => {
      Reflect.deleteProperty(appUserAccess, 'activationCode')
      const invalid = () => appUserAccess.validate()
      expect(invalid).toThrow()
    })

    it('should throw on anonymous user', () => {
      appUserAccess.type = 'anonymous'
      const invalid = () => appUserAccess.validate()
      expect(invalid).toThrow()
    })

    it('should validate itself', done => {
      const path = `${paths.dummy}/${appUserAccessTemplate.evrythngUser}/validate`
      appUserAccess.validate().then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
        expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
          authorization: apiKey,
          method: 'post',
          data: { activationCode: appUserAccessTemplate.activationCode }
        }))
      }).then(done)
    })
  })

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), AppUserAccess.resourceFactory())
      appUserAccessResource = scope.appUser()
    })

    it('should create new AppUserAccess resource', () => {
      expect(appUserAccessResource instanceof Resource).toBe(true)
      expect(appUserAccessResource.type).toBe(AppUserAccess)
      expect(appUserAccessResource.path).toEqual(`${paths.appUsersAccess}`)
    })

    describe('create', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
      })

      it('should create normal user', done => {
        appUserAccessResource.create(appUserTemplate).then(() => {
          expect(Resource.prototype.create).toHaveBeenCalledWith(appUserTemplate)
        }).then(done)
      })

      it('should support callback in second param', done => {
        appUserAccessResource.create(appUserTemplate, cb).then(() => {
          expect(Resource.prototype.create.calls.mostRecent().args[1])
            .toEqual(cb)
        }).then(done)
      })

      it('should support callback in third param', done => {
        appUserAccessResource.create(appUserTemplate, optionsTemplate, cb)
          .then(() => {
            expect(Resource.prototype.create.calls.mostRecent().args[2])
              .toEqual(cb)
          })
          .then(done)
      })

      it('should create anonymous user', done => {
        const anonymousUserTemplate = Object.assign(
          { anonymous: true },
          appUserTemplate
        )
        appUserAccessResource.create(anonymousUserTemplate).then(() => {
          expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
            authorization: apiKey,
            method: 'post',
            params: { anonymous: true },
            data: {}
          }))
        }).then(done)
      })

      describe('validate', () => {
        it('should validate', done => {
          const activationCode = 'code'
          const path = `${paths.appUsersAccess}/${appUserAccessTemplate.evrythngUser}/validate`
          appUserAccessResource = scope.appUser(appUserAccessTemplate.evrythngUser)
          appUserAccessResource.validate(activationCode).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
            expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
              authorization: apiKey,
              method: 'post',
              data: { activationCode }
            }))
          }).then(done)
        })
      })
    })
  })
})
