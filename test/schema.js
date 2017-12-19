module.exports = {
    get: {
      '/': {
        query: {
          name: {
            validate(value) {
              console.log('YOUHOUUUUU')
              return !(value === 'ellon')
            }
          }
        }
      }
    }
  }
