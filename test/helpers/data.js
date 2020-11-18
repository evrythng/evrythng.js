export const apiKey = 'apiKey'
export const operatorApiKey = 'operatorApiKey'
export const appApiKey = 'appApiKey'

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

export const userTemplate = {
  id: 'userId',
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

export const reactorScheduleTemplate = {
  id: 'reactorScheduleId',
  enabled: true
}

export const reactorLogTemplate = {
  message: 'Log example message',
  logLevel: 'info',
  createdAt: 1
}

export const fileTemplate = {
  id: 'fileId',
  contentUrl: 'http://example.com/test.jpg',
  name: 'File example'
}

export const userAccessTemplate = {
  evrythngUser: 'userId',
  activationCode: 'activactionCode'
}

export const accountTemplate = {
  id: 'accountId',
  name: 'accountName'
}
