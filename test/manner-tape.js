
/**
 * Test dependencies.
 */

const test = require('..')
const service = require('./service')
const schema = require('./schema')


test(service, require('./test.json'), schema)
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
