module.exports = {
    get: {
      '/': {
        query: {
          name: {
            validate(value) {
              return !(value === 'ellon')
            }
          }
        }
      }
    }
  }
