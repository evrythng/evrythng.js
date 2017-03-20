export const apiKey = 'apiKey'

export const optionsTemplate = {
  fullResponse: true,
  headers: {
    'Accept': '*/*'
  }
}

export const entityTemplate = {
  foo: 'bar'
}

export const productTemplate = {
  id: 'productId',
  name: 'Test Product'
}

export const thngTemplate = {
  id: 'thndId',
  name: 'Test Thng'
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

export const operatorTemplate = {
  id: 'operatorId',
  firstName: 'Test',
  lastName: 'Operator',
  email: 'test@evrythng.com'
}
