export default class Product {
  static resourceFactory () {
    return {
      product () {
        console.log('Product resource factor', arguments)
      }
    }
  }
}
