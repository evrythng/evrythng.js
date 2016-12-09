/* eslint-env jasmine */
import * as evrythng from '../../src/evrythng'

describe('EVT', () => {
  it('should contain version', () => {
    expect(evrythng.version).toBeDefined()
  })

  it('should contain correct version', () => {
    expect(evrythng.version).toBe('5.0.0')
  })
})
