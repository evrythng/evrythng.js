/* eslint-env jasmine */
import * as evrythng from '../../src/evrythng'

// Unit tested separately. Just to confirm the evrythng module is exposing the
// right stuff.
import settings from '../../src/settings'
import setup from '../../src/setup'

describe('evrythng', () => {
  describe('settings', () => {
    it('should expose settings', () => {
      expect(evrythng.settings).toBe(settings)
    })
  })

  describe('setup', () => {
    it('should expose settings setup', () => {
      expect(evrythng.setup).toBe(setup)
    })
  })
})
