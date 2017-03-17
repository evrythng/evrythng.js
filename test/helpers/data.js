export default {
  apiKey: 'apiKey',
  operator: {
    id: 'operatorId',
    firstName: 'Test',
    lastName: 'Operator'
  },
  thng: {
    id: 'thndId',
    name: 'Test Thng'
  }
}

export const apiKey = 'apiKey'

export const optionsTemplate = {
  fullResponse: true,
  headers: {
    'Accept': '*/*'
  }
}

export const paths = {
  actions: '/actions',
  dummy: '/path',
  products: '/products',
  properties: '/properties'
}

export const entityTemplate = {
  foo: 'bar'
}

export const productTemplate = {
  id: 'productId',
  name: 'Test Product'
}

export const propertyTemplate = {
  key: 'test',
  value: 1
}

export const actionTemplate = {
  id: 'actionId',
  type: 'test',
  product: productTemplate.id
}
