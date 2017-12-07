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
  Object.keys(json).map(key => {
    const method = json[key]
    Object.keys(method).map(path => {
      method[path].map(obj => {
        const result = obj.result
        const {
          status,
          payload
        } = result
        tape(obj.description, assert => {
          assert.plan(plan(status, payload))
          test[key](path, obj.query || {}, obj.body || {}).then(response => {
            if (status != null) assert.equal(response.status, status)
            if (payload != null) assert.deepEqual(response.payload, payload)
          })
        })
      })
    })
  })
}


/**
 * Plan the number or tests based
 * on the number of arguments.
 *
 * @return {Number}
 * @api private
 */

function plan () {
  var nb = 0
  for (var l = arguments.length; l--;) {
    if (arguments[l] != null) nb++
  }
  return nb
}

service.test = tape
