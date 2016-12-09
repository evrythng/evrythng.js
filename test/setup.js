/**
 * Use dirty-chai to fix linting errors related to Chai
 * expression statements, using getters for assertions.
 * https://www.npmjs.com/package/dirty-chai
 */
(function (global, factory) {
  /* global define */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(exports, require('chai'), require('dirty-chai'))
  } else if (typeof define === 'function' && define.amd) {
    define(['exports', 'chai', 'dirty-chai'], factory)
  }
}(this, function (exports, chai, dirtyChai) {
  // dirty-chai plugin already does this for the browser
  // https://github.com/prodatakey/dirty-chai/blob/master/lib/dirty-chai.js#L15
  chai.use(dirtyChai)
  exports.expect = chai.expect
}))
