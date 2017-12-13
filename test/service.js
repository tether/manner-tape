

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
        city: 'calgary',
      }
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
    }
  }
}
