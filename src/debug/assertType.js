// © Andrew Wei

var assert = require('assert');
var checkType = require('./checkType');

/**
 * Asserts the specified condition and throws a warning if assertion fails.
 * Internal use only.
 *
 * @param {*} value - Value used for the assertion.
 * @param {String|Class} type - Type(s) to evaluate against. If this is a
 *                              string, this method will use 'typeof' operator.
 *                              Otherwise 'instanceof' operator will be used. If
 *                              this parameter is an array, all elements in the
 *                              array will be evaluated against.
 * @param {boolean} [allowUndefined=false] - Specifies whether assertion should
 *                                           pass if the supplied value is
 *                                           undefined.
 * @param {string} [message] - Message to be displayed when assertion fails.
 *
 * @throws Error if assert fails.
 *
 * @alias module:meno~helpers.assertType
 */
function assertType(value, type, allowUndefined, message) {
  assert(type !== undefined, 'Paremeter \'type\' must be a string or a class');
  assert((allowUndefined === undefined) || (typeof allowUndefined === 'boolean'), 'Paremeter \'allowUndefined\', if specified, must be a boolean');
  assert((message === undefined) || (typeof message === 'string'), 'Parameter \'message\', if specified, must be a string');

  allowUndefined = (allowUndefined === undefined) ? false : allowUndefined;

  if (allowUndefined && (value === undefined)) return;

  if (type instanceof Array) {
    let n = type.length;

    for (let i = 0; i < n; i++) {
      if (checkType(value, type[i])) return;
    }

    throw new Error(message || 'AssertType failed');
  }

  if (checkType(value, type)) return;

  throw new Error(message || 'AssertType failed');
}

module.exports = assertType;
