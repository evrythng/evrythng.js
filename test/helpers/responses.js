import * as data from './data'

export default {
  ok: {
    status: 200,
    body: {}
  },

  noContent: {
    status: 204,
    body: null
  },

  error: {
    generic: {
      status: 400,
      body: {
        status: 400,
        errors: ['Generic error']
      }
    }
  },

  access: {
    operator: {
      body: {
        actor: {
          type: 'operator',
          id: data.operatorTemplate.id
        },
        apiKey: data.apiKey
      }
    }
  },

  operator: {
    one: {
      body: data.operatorTemplate
    }
  },

  entity: {
    one: {
      body: data.entityTemplate
    },
    multiple: {
      body: [data.entityTemplate, data.entityTemplate]
    }
  }
}
