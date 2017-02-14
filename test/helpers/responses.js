import data from './data'

export default {
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
          id: data.operator.id
        },
        apiKey: data.apiKey
      }
    }
  },

  operator: {
    one: {
      body: data.operator
    }
  }
}
