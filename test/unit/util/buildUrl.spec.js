/* eslint-env jasmine */
import buildUrl from '../../../src/util/buildUrl'
import paths from '../../helpers/paths'

const apiUrl = paths.testBase
const url = paths.dummy

describe('buildUrl', () => {
  it('should join base apiUrl and path given in options', () => {
    expect(buildUrl({ apiUrl, url })).toEqual(`${apiUrl}${url}`)
  })

  it('should convert params object to query string', () => {
    const params = {
      foo: 'bar',
      baz: 1
    }
    const paramsStr = 'foo=bar&baz=1'
    expect(buildUrl({ apiUrl, url, params })).toEqual(`${apiUrl}${url}?${paramsStr}`)
  })
})
