// © Andrew Wei

/**
 * Checks if an object literal has the specified value in one of its keys.
 *
 * @param {Object} object - Target object literal.
 * @param {*} value - Value to check.
 *
 * @return {boolean} True if value is found, false otherwise.
 *
 * @alias module:meno~helpers.hasOwnValue
 */
function hasOwnValue(object, value) {
  for (let k in object) {
    if (object.hasOwnProperty(k) && (object[k] === value)) return true;
  }

  return false;
}

export default hasOwnValue;
