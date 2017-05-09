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

export const positionTemplate = {
  coords: {
    latitude: 1,
    longitude: 2
  }
}

export const locationTemplate = {
  position: {
    type: 'Point',
    coordinates: [1.1, 2.2]
  },
  timestamp: 1
}

export const collectionTemplate = {
  id: 'collectionId',
  name: 'Test Collection'
}

export const actionTypeTemplate = {
  name: '_foobar',
  customFields: {
    displayname: 'Foo Bar'
  }
}

export const projectTemplate = {
  id: 'projectId',
  name: 'Test Project'
}

export const applicationTemplate = {
  id: 'applicationId',
  name: 'Test Application'
}

export const roleTemplate = {
  id: 'roleId',
  name: 'Test Role'
}

export const appUserTemplate = {
  id: 'appUserId',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@evrythng.com'
}

export const batchTemplate = {
  id: 'batchId',
  name: 'Test Batch'
}

export const placeTemplate = {
  id: 'placeId',
  name: 'Test Place'
}
