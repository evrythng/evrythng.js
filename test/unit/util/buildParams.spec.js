/* eslint-env jasmine */
import buildParams from '../../../src/util/buildParams'

describe('buildParams', () => {
  it('should handle empty params', () => {
    expect(buildParams()).toEqual('')
    expect(buildParams({})).toEqual('')
  })

  it('should do nothing on string values', () => {
    const qs = 'foo=bar'
    expect(buildParams(qs)).toEqual(qs)
  })

  it('should join params', () => {
    const params = {
      foo: 'bar',
      baz: 1
    }
    const paramsStr = 'foo=bar&baz=1'
    expect(buildParams(params)).toEqual(paramsStr)
  })

  it('should encode query string', () => {
    const params = {
      'a+b': 'a=b'
    }
    const paramsStr = 'a%2Bb=a%3Db'
    expect(buildParams(params)).toEqual(paramsStr)
  })

  it('should handle nested params', () => {
    const params = {
      a: {
        b: 'c',
        d: 'e=1'
      },
      f: 1
    }
    const paramsStr = 'a=b%3Dc%26d%3De%253D1&f=1'
    expect(buildParams(params)).toEqual(paramsStr)
  })

  it('should escape special characters', () => {
    const params = {
      a: 'va|ue'
    }
    const paramsStr = 'a=va%7Cue'
    expect(buildParams(params)).toEqual(paramsStr)
  })
})
