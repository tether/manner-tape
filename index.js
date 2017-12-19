/**
 * dependencies
 */

const tape = require('tape')
const manner = require('manner-test')
const isokay = require('isokay')
const mixin = require('deepmix')
const clone = require('clone-deep')

/**
 * Expose test runner.
 */

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
  return new Promise((resolve, reject) => {
    tape.onFinish(resolve)
    if (typeof service === 'string') {
      service = require(service)
      try {
        schema = require(service + '/schema.js')
      } catch (e) {
        console.log(e)
      }
    }
    const test = manner(service, schema)
    Object.keys(json).map(key => {
      const method = json[key]
      Object.keys(method).map(route => {
        var cases = method[route]
        var cb = test[key]
        if (cases instanceof Array) {
          cases.map(obj => testCase(cb, route, obj))
        } else {
          Object.keys(cases).map(identifier => testCase(cb, route, cases[identifier]))
        }
      })
    })
  })
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
    const result = obj.result
    const {
      status,
      multiline,
      payload
    } = result
    tape(obj.description, assert => {
      assert.plan(plan(status, payload))
      method(route, obj.query || {}, obj.body || {}).then(response => {
        var returned = response.payload
        if (status != null) assert.equal(response.status, status)
        if (payload != null) {
          if (typeof payload === 'function') {
            assert.equal(payload(returned), true)
          } else {
            if (multiline) returned = parse(returned)
            if (typeof payload === 'object') {
              if (returned instanceof Buffer) returned = JSON.parse(returned)
              assert.deepEqual(returned, mixin(clone(returned), clone(payload)))
            } else {
              assert.deepEqual(returned, payload)
            }
          }
        }
      })
    })
}



/**
 * Parse multiline json delimited by line break.
 *
 * @param {String} response
 * @return {Array}
 * @api private
 */

function parse (json) {
  const arr = json.toString().split('\n')
  arr.pop()
  return arr.map(org => JSON.parse(org))
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
