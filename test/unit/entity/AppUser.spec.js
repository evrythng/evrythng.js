/* eslint-env jasmine */
import Resource from '../../../src/resource/Resource'
import AppUser from '../../../src/entity/AppUser'
import fetchMock from 'fetch-mock'
import apiUrl from '../../helpers/apiUrl'
import mockApi from '../../helpers/apiMock'
import paths from '../../helpers/paths'
import { dummyScope, dummyResource } from '../../helpers/dummy'
import {
  apiKey,
  optionsTemplate,
  userTemplate,
  userAccessTemplate
} from '../../helpers/data'

const cb = () => {}
let userAccessResource
let userAccess
let scope

describe('AppUser', () => {
  mockApi()

  it('should convert evrythngUser property to standard id', () => {
    userAccess = new AppUser(dummyResource(), userAccessTemplate)
    expect(userAccess.id).toEqual(userAccessTemplate.evrythngUser)
    expect(userAccess.evrythngUser).not.toBeDefined()
  })

  describe('validate', () => {
    beforeEach(() => {
      userAccess = new AppUser(dummyResource(), userAccessTemplate)
    })

    it('should throw if no activation code provided', () => {
      Reflect.deleteProperty(userAccess, 'activationCode')
      const invalid = () => userAccess.validate()
      expect(invalid).toThrow()
    })

    it('should throw on anonymous user', () => {
      userAccess.type = 'anonymous'
      const invalid = () => userAccess.validate()
      expect(invalid).toThrow()
    })

    it('should validate itself', done => {
      const path = `${paths.dummy}/${userAccessTemplate.evrythngUser}/validate`
      userAccess.validate().then(() => {
        expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
        expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
          apiKey,
          method: 'post',
          body: JSON.stringify({ activationCode: userAccessTemplate.activationCode })
        }))
      }).then(done)
    })
  })

  describe('resourceFactory', () => {
    beforeEach(() => {
      scope = Object.assign(dummyScope(), AppUser.resourceFactory())
      userAccessResource = scope.userAccess()
    })

    it('should create new AppUser resource', () => {
      expect(userAccessResource instanceof Resource).toBe(true)
      expect(userAccessResource.type).toBe(AppUser)
      expect(userAccessResource.path).toEqual(`${paths.usersAccess}`)
    })

    describe('create', () => {
      beforeEach(() => {
        spyOn(Resource.prototype, 'create').and.returnValue(Promise.resolve())
      })

      it('should create normal user', done => {
        userAccessResource.create(userTemplate).then(() => {
          expect(Resource.prototype.create).toHaveBeenCalledWith(userTemplate)
        }).then(done)
      })

      it('should support callback in second param', done => {
        userAccessResource.create(userTemplate, cb).then(() => {
          expect(Resource.prototype.create.calls.mostRecent().args[1])
            .toEqual(cb)
        }).then(done)
      })

      it('should support callback in third param', done => {
        userAccessResource.create(userTemplate, optionsTemplate, cb)
          .then(() => {
            expect(Resource.prototype.create.calls.mostRecent().args[2])
              .toEqual(cb)
          })
          .then(done)
      })

      it('should create anonymous user', done => {
        const anonymousUserTemplate = Object.assign(
          { anonymous: true },
          userTemplate
        )
        userAccessResource.create(anonymousUserTemplate).then(() => {
          expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
            apiKey,
            method: 'post',
            params: { anonymous: true },
            body: JSON.stringify({})
          }))
        }).then(done)
      })

      describe('validate', () => {
        it('should validate', done => {
          const activationCode = 'code'
          const path = `${paths.usersAccess}/${userAccessTemplate.evrythngUser}/validate`
          userAccessResource = scope.userAccess(userAccessTemplate.evrythngUser)
          userAccessResource.validate(activationCode).then(() => {
            expect(fetchMock.lastUrl()).toEqual(apiUrl(path))
            expect(fetchMock.lastOptions()).toEqual(jasmine.objectContaining({
              apiKey,
              method: 'post',
              body: JSON.stringify({ activationCode })
            }))
          }).then(done)
        })
      })
    })
  })
})
