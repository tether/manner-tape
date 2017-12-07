

module.exports = {
  get: {
    '/' : (query) => {
      const name = query.name || 'world'
      return 'hello ' + name
    },
    '/unauthorized': () => {
      const error = new Error('Unauthorized')
      error.status = 403
      return error
    }
  }
}
