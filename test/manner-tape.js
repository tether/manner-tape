
/**
 * Test dependencies.
 */

const test = require('..')
const service = require('./service.js')


test(service, require('./test.json'))
test(service, {
  get: {
    '/': {
      identifier: {
        description: 'programmatic payload',
        result: {
          payload: value => {
            return value === 'hello world'
          }
        }
      }
    }
  }
})
