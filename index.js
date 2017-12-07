/**
 * dependencies
 */

const tape = require('tape')
const manner = require('manner-test')


module.exports = service


/**
 * Run manner service agains json object describing
 * the expected ouput for given inputs.
 *
 * @param {Object} service
 * @param {Object} json
 * @api public
 */

function service(service, json) {
  const test = manner(service)
  Object
    .keys(json)
    .map(key => {
      const method = json[key]
      Object.keys(method).map(path => {
        method[path].map(obj => {
          const result = obj.result
          tape(obj.description, assert => {
            assert.plan(2)
            test[key](path, obj.query || {}, obj.body || {}).then(response => {
              assert.equal(response.status, result.status)
              assert.deepEqual(response.payload, result.payload)
            }, err => {
              console.log('ERROR', err)
            })
          })
        })
      })
    })
}

service.test = tape
