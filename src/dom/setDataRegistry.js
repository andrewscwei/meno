// © Andrew Wei

'use strict';

import assertType from '../helpers/assertType';

/**
 * Sets the data registry.
 *
 * @param {Object} data - Sets the data registry.
 *
 * @alias module:meno~dom.setDataRegistry
 */
function setDataRegistry(data) {
  assertType(data, 'object', false, 'Invalid data specified');
  if (!window.__private__) window.__private__ = {};
  window.__private__.dataRegistry = data;
}

export default setDataRegistry;
