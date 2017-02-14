export default class Thng {
  static resourceFactory () {
    return {
      thng () {
        console.log('Thng resource factor', arguments)
      }
    }
  }
}
