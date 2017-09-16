/*! Meno, © Andrew Wei, @license MIT */

'use strict';

import getChild from 'dom/getChild';
import addChild from 'dom/addChild';
import hasChild from 'dom/hasChild';
import removeChild from 'dom/removeChild';
import addClass from 'dom/addClass';
import hasClass from 'dom/hasClass';
import removeClass from 'dom/removeClass';
import getAttribute from 'dom/getAttribute';
import setAttribute from 'dom/setAttribute';
import hasAttribute from 'dom/hasAttribute';
import getStyle from 'dom/getStyle';
import setStyle from 'dom/setStyle';
import hasStyle from 'dom/hasStyle';
import createElement from 'dom/createElement';
import register from 'dom/register';
import sightread from 'dom/sightread';
import Directive from 'enums/Directive';
import DirtyType from 'enums/DirtyType';
import NodeState from 'enums/NodeState';
import Element from 'ui/Element';
import EventQueue from 'events/EventQueue';

// import 'document-register-element';

if (process.env.NODE_ENV === 'development') {
  var assert = require('assert');
  assert(window && document, 'Meno is a front-end web framework where \'window\' and \'document\' must be defined');
}

/**
 * @module meno
 */
function meno() {
  return (arguments.length > 0) ? register.apply(null, arguments) : sightread.apply(null, arguments);
}

meno.version = process.env.BUNDLE_VERSION;

meno.Element = Element;
meno.EventQueue = EventQueue;

meno.Directive = Directive;
meno.DirtyType = DirtyType;
meno.NodeState = NodeState;

meno.sightread = sightread;
meno.register = register;

meno.dom = {
  getChild: getChild,
  addChild: addChild,
  hasChild: hasChild,
  removeChild: removeChild,
  addClass: addClass,
  hasClass: hasClass,
  removeClass: removeClass,
  getAttribute: getAttribute,
  setAttribute: setAttribute,
  hasAttribute: hasAttribute,
  getStyle: getStyle,
  setStyle: setStyle,
  hasStyle: hasStyle,
  createElement: createElement
};

meno();

module.exports = meno;
