

module.exports = {
  get: {
    '/' : (query) => {
      const name = query.name || 'world'
      return 'hello ' + name
    },
    '/subset': () => ({
      id: 'hello world',
      user: {
        name: 'olivier',
        city: 'calgary'
      },
      certs: [{
        properties: 'hello',
        identity: {
          low: 200
        }
      }]
    }),
    '/subsetArray': () => {
      return [
        'hello world',
        {
          id: 'hello world',
          user: {
            name: 'olivier',
            city: 'calgary',
          }
        }
      ]
    },
    '/unauthorized': () => {
      const error = new Error('Unauthorized')
      error.status = 403
      return error
    },
    '/multiline': () => {
      return '{"keys":["org"],"length":1,"_fields":[{"identity":{"low":375,"high":0},"labels":["Organization"],"properties":{"name_legal":"Facebook"}}],"_fieldLookup":{"org":0}}\n{"keys":["org"],"length":1,"_fields":[{"identity":{"low":376,"high":0},"labels":["Organization"],"properties":{"name_legal":"Olivier"}}],"_fieldLookup":{"org":0}}\n'
    }
  }
}
