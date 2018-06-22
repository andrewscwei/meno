/* ! Meno, © Andrew Wei, @license MIT */

import Element from './core/Element';
import getChild from './dom/getChild';
import hasChild from './dom/hasChild';
import getAttribute from './dom/getAttribute';
import setAttribute from './dom/setAttribute';
import getStyle from './dom/getStyle';
import setStyle from './dom/setStyle';
import register from './dom/register';
import vnode from './vdom/vnode';
import Directive from './enums/Directive';
import DirtyType from './enums/DirtyType';
import NodeState from './enums/NodeState';

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

meno.Element = Element;
meno.Directive = Directive;
meno.DirtyType = DirtyType;
meno.NodeState = NodeState;
meno.register = register;
meno.h = vnode;
meno.dom = {
  getChild: getChild,
  hasChild: hasChild,
  getAttribute: getAttribute,
  setAttribute: setAttribute,
  getStyle: getStyle,
  setStyle: setStyle
};

module.exports = meno;
