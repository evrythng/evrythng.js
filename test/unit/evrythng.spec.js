/* eslint-env mocha */
import { expect } from '../setup'
import * as evrythng from '../../src/evrythng'

describe('EVT', () => {
  it('should contain version', () => {
    expect(evrythng.version).to.exist()
  })

  it('should contain correct version', () => {
    expect(evrythng.version).to.equal('5.0.0')
  })
})
