// © Andrew Wei

'use strict';

/**
 * Checks if a given value is equal to null. Option to specify recursion, which
 * would further evaluate inner elements, such as when an Array or Object is
 * specified.
 *
 * @param {*} value - Value to evaluate.
 * @param {boolean} [recursive=false] - Specifies whether to recursively
 *                                      evaluate the supplied value's inner
 *                                      values (i.e. an Array or Object).
 *
 * @return {boolean} True if null, false otherwise.
 *
 * @alias module:meno~helpers.noval
 */
function noval(value, recursive) {
  if (recursive === undefined) recursive = false;

  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return (value === '');
  
  if (recursive && (value instanceof Array)) {
    const n = value.length;
    for (let i = 0; i < n; i++) {
      if (!noval(value[i], true)) return false;
    }
    return true;
  }
  else if (recursive && (typeof value === 'object') && (value.constructor === Object)) {
    for (let p in value) {
      if (!noval(value[p], true)) return false;
    }
    return true;
  }
  else {
    return false;
  }
}

export default noval;
