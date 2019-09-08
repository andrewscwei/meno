/* ! Meno, © Andrew Wei, @license MIT */

import Element from './core/Element';
import getAttribute from './dom/getAttribute';
import getChild from './dom/getChild';
import getStyle from './dom/getStyle';
import hasChild from './dom/hasChild';
import register from './dom/register';
import setAttribute from './dom/setAttribute';
import setStyle from './dom/setStyle';
import Directive from './enums/Directive';
import DirtyType from './enums/DirtyType';
import NodeState from './enums/NodeState';
import vnode from './vdom/vnode';

if (process.env.NODE_ENV === `development`) {
  var assert = require(`assert`);
  var version = require(`../package.json`).version;
  assert(window && document, `Meno is a front-end web framework where 'window' and 'document' must be defined`);
  console.log(`Meno v${version} is running in debug mode`); // eslint-disable-line no-console
}

/**
 * @module meno
 */
function meno() {
  register.apply(null, arguments);
}

export { Element, Directive, DirtyType, NodeState, register, vnode as h };

export const dom = {
  getChild: getChild,
  hasChild: hasChild,
  getAttribute: getAttribute,
  setAttribute: setAttribute,
  getStyle: getStyle,
  setStyle: setStyle
};

export default meno;
