// © Andrew Wei

'use strict';

import getChildRegistry from 'dom/getChildRegistry';
import noval from 'helpers/noval';

if (process.env.NODE_ENV === 'development') {
  var assertType = require('debug/assertType');
}

/**
 * Gets the a child from the global display tree consisting of all sightread
 * Element instances.
 *
 * @param {Node} [element] - Specifies the parent element instance to fetch the
 *                           child from.
 * @param {string} [name] - Name of the child, depth separated by '.' (i.e.
 *                          'foo.bar'). If unspecified, the entire child list of
 *                          this Element will be returned.
 * @param {boolean} [recursive=true] - Speciifies whether to search for the
 *                                     child recursively down the tree.
 *
 * @return {Node|Array|Object}
 *
 * @alias module:meno~dom.getChild
 */
function getChild() {
  let element = undefined;
  let name = undefined;
  let recursive = undefined;

  let arg1 = arguments[0];
  if ((arg1 === window) || (arg1 === document) || (arg1 instanceof Node) || (arg1 === null) || (arg1 === undefined))
    element = arg1;
  else if (typeof arg1 === 'string')
    name = arg1;
  else if (typeof arg1 === 'boolean')
    recursive = arg1;

  let arg2 = arguments[1];
  if ((name === undefined) && ((typeof arg2 === 'string') || (arg2 === null) || (arg2 === undefined)))
    name = arg2;
  else if ((recursive === undefined) && (typeof arg2 === 'boolean'))
    recursive = arg2;

  let arg3 = arguments[2];
  if ((recursive === undefined) && (typeof arg3 === 'boolean')) {
    recursive = arg3;
  }

  if (process.env.NODE_ENV === 'development') {
    assertType(name, 'string', true, 'Child name must be string')
    assertType(recursive, 'boolean', true, 'Parameter \'recursive\', if specified, must be a boolean');
  }

  let childRegistry = getChildRegistry(element);
  if (!childRegistry) return (typeof (element || document).querySelector === 'function') ? (element || document).querySelector(name) : null
  if (!name) return childRegistry;

  recursive = (typeof recursive === 'boolean') ? recursive : true;

  let targets = name.split('.');
  let currentTarget = targets.shift();
  let child = childRegistry[currentTarget];

  if (recursive && (targets.length > 0)) {
    if (child instanceof Array) {
      let children = [];
      let n = child.length;

      for (let i = 0; i < n; i++)
        children.push(getChild(child[i], targets.join('.'), recursive));

      return (noval(children, true) ? null : children);
    }
    else {
      return getChild(child, targets.join('.'), recursive);
    }
  }
  else {
    if (noval(child, true)) return (typeof (element || document).querySelector === 'function') ? (element || document).querySelector(name) : null;
    return child;
  }
}

export default getChild;
