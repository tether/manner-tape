

module.exports = {
  get: {
    '/' : (query) => {
      const name = query.name || 'world'
      return 'hello ' + name
    }
  }
}
