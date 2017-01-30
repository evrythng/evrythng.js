export default class FakePromise {
  constructor () {
    return new Promise(function (resolve, reject) {
      this.resolve = resolve
      this.reject = reject
    })
  }
}
