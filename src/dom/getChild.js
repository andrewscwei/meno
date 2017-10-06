// © Andrew Wei

'use strict';

import Directive from '../enums/Directive';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
}

/**
 * Gets the a child from the global display tree consisting of all sightread
 * Element instances.
 *
 * @param {Element} [element] - Specifies the parent element instance to fetch
 *                              the child from.
 * @param {string} name - Name of the child, depth separated by '.' (i.e.
 *                        'foo.bar').
 *
 * @return {Node|Array|Object}
 *
 * @alias module:meno~dom.getChild
 */
function getChild() {
  let args = Array.prototype.slice.call(arguments);

  const element = (typeof args[0] !== 'string') && args.shift() || document;
  const name = args.shift();

  if (process.env.NODE_ENV === 'development') {
    assert((element === window) || (element === document) || (element instanceof Element), 'Invalid element specified');
    assert(typeof name === 'string', 'Child name must be string');
  }

  const selectors = name.split('.').map(val => (`[${Directive.NAME}='${val}']`)).join(' ');
  const results = (element.shadowRoot || element || document).querySelectorAll(selectors);

  if (results === null || results === undefined) return null;
  if (results.length === 0) return null;
  if (results.length === 1) return results[0];
  return Array.from(results);
}

export default getChild;
