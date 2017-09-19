/*! Meno, © Andrew Wei, @license MIT */

'use strict';

import getChild from 'dom/getChild';
import hasChild from 'dom/hasChild';
import getAttribute from 'dom/getAttribute';
import setAttribute from 'dom/setAttribute';
import hasAttribute from 'dom/hasAttribute';
import getStyle from 'dom/getStyle';
import setStyle from 'dom/setStyle';
import hasStyle from 'dom/hasStyle';
import register from 'dom/register';
import VNode from 'vdom/VNode';
import Directive from 'enums/Directive';
import DirtyType from 'enums/DirtyType';
import NodeState from 'enums/NodeState';
import Element from 'ui/Element';
import EventQueue from 'events/EventQueue';

import 'document-register-element';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
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
meno.EventQueue = EventQueue;
meno.Directive = Directive;
meno.DirtyType = DirtyType;
meno.NodeState = NodeState;
meno.register = register;
meno.h = VNode;
meno.dom = {
  getChild: getChild,
  hasChild: hasChild,
  getAttribute: getAttribute,
  setAttribute: setAttribute,
  hasAttribute: hasAttribute,
  getStyle: getStyle,
  setStyle: setStyle,
  hasStyle: hasStyle
};

module.exports = meno;
