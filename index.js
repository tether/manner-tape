/**
 * dependencies
 */

const tape = require('tape')
const manner = require('manner-test')
const isokay = require('isokay')


module.exports = service


/**
 * Run manner service agains json object describing
 * the expected ouput for given inputs.
 *
 * @param {Object} service
 * @param {Object} json
 * @param {Object} schema
 * @api public
 */

function service(service, json, schema = {}) {
  const promises = []
  const test = manner(service, schema)
  Object.keys(json).map(key => {
    const method = json[key]
    Object.keys(method).map(route => {
      var cases = method[route]
      var cb = test[key]
      if (cases instanceof Array) {
        cases.map(obj => promises.push(testCase(cb, route, obj)))
      } else {
        Object.keys(cases).map(identifier => promises.push(testCase(cb, route, cases[identifier])))
      }
    })
  })
  return Promise.all(promises)
}


/**
 * Run test case.
 *
 * @param {Function} method
 * @param {String} route
 * @param {Object} obj
 * @api private
 */

function testCase (method, route, obj) {
  return new Promise(resolve => {
    const result = obj.result
    const {
      status,
      payload
    } = result
    tape(obj.description, assert => {
      assert.plan(plan(status, payload))
      method(route, obj.query || {}, obj.body || {}).then(response => {
        if (status != null) assert.equal(response.status, status)
        if (payload != null) {
          if (typeof payload === 'function') {
            assert.equal(payload(response.payload), true)
          } else {
            assert.deepEqual(response.payload, payload)
          }
        }
        resolve()
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
