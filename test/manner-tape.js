
/**
 * Test dependencies.
 */

const test = require('..')
const service = require('./service')
const schema = require('./schema')


test(service, require('./tests-expected-to-pass'), schema)
test(service, require('./tests-expected-to-fail'), schema, true)
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
