/* ! Meno, © Andrew Wei, @license MIT */

import Element from './core/Element';
import * as dom from './dom';
import Directive from './enums/Directive';
import DirtyType from './enums/DirtyType';
import NodeState from './enums/NodeState';
import vnode from './vdom/vnode';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
  var version = require('../package.json').version;
  assert(window && document, 'Meno is a front-end web framework where \'window\' and \'document\' must be defined');
  console.log(`Meno v${version} is running in debug mode`); // eslint-disable-line no-console
}

export const register = dom.register;
export const h = vnode;

export { Element, Directive, DirtyType, NodeState, dom };

/**
 * @module meno
 */
function meno() {
  register.apply(null, arguments);
}

export default meno;
