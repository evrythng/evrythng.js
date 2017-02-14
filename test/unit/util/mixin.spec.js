/* eslint-env jasmine */
import mixin from '../../../src/util/mixin'

const behavior = {
  foo () {}
}
class Dummy {
  test () {}
}

let Mixin

describe('mixin', () => {
  beforeEach(() => {
    // real use-case scenario
    Mixin = mixin(behavior)(class extends Dummy {})
  })

  it('should add behavior to target', () => {
    expect(Mixin.prototype.foo).toBeDefined()
    expect(Mixin.prototype.test).toBeDefined()
  })

  it('should not modify base class', () => {
    expect(Dummy.prototype.foo).not.toBeDefined()
    expect(Dummy.prototype.test).toBeDefined()
  })

  it('should inherit from class', () => {
    expect(Mixin.constructor).toBe(Dummy.constructor)
  })
})
