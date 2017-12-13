/**
 * dependencies
 */

const tape = require('tape')
const manner = require('manner-test')
const isokay = require('isokay')
const mixin = require('deepmix')


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
  if (typeof service === 'string') {
    service = require(service)
    try {
      schema = require(service + '/schema.js')
    } catch (e) {
      console.log(e)
    }
  }
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
              var obj1 = merge(returned, payload)
              assert.deepEqual(returned, obj1)
            } else {
              assert.deepEqual(returned, payload)
            }
          }
        }
        resolve()
      })
    })
  })
}


/**
 * Merge two object together.

 *
 * @param {Object|Buffer} from
 * @param {Object} to
 * @return {Object}
 * @api private
 */

function merge (from, to) {
  var clone = Object.assign({}, from)
  return mixin(clone, to)
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
