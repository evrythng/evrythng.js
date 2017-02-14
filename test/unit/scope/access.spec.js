/* eslint-env jasmine */
import { OperatorAccess } from '../../../src/scope/access'

class Dummy {
  test () {}
}

describe('OperatorAccess mixin', () => {
  let Operator

  beforeEach(() => {
    Operator = OperatorAccess(Dummy)
  })

  it('should add all resources available to Operator scope', () => {
    expect(Operator.prototype.product).toBeDefined()
    expect(Operator.prototype.thng).toBeDefined()
    // TODO complete
  })
})
