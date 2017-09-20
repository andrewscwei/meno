/*! Meno, © Andrew Wei, @license MIT */

'use strict';

import Element from 'core/Element';
import getChild from 'dom/getChild';
import hasChild from 'dom/hasChild';
import getAttribute from 'dom/getAttribute';
import setAttribute from 'dom/setAttribute';
import getStyle from 'dom/getStyle';
import setStyle from 'dom/setStyle';
import register from 'dom/register';
import vnode from 'vdom/vnode';
import Directive from 'enums/Directive';
import DirtyType from 'enums/DirtyType';
import NodeState from 'enums/NodeState';

import 'document-register-element';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
  var debug = require('debug')('meno');
  debug(`v${process.env.BUNDLE_VERSION}, debug mode`);
  assert(window && document, 'Meno is a front-end web framework where \'window\' and \'document\' must be defined');
}

/**
 * @module meno
 */
function meno() {
  register.apply(null, arguments);
}

meno.version = process.env.BUNDLE_VERSION;
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
